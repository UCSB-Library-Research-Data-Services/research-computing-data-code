<?php

/**
 * @file
 * Contains \DrupalProject\composer\install-libraries.
 * https://gist.github.com/datvance/09dfb274c77e2a8104e415f8f1854557
 */

namespace DrupalProject\composer;

use stdClass;

class LibraryInstaller
{
    protected array $libraries = [];
    protected string $libraries_path = '';
    protected string $modules_path = '';
    protected string $tmp_dir = '';
    protected bool $debug = true;

    public function __construct()
    {
        $drupal_root = realpath(dirname(dirname(__DIR__)) . '/web');
        //Pantheon places all modules managed by composer here
        $this->modules_path = $drupal_root . '/modules/contrib';
        $this->libraries_path = $drupal_root . '/libraries';
        //hope this is writable
        $this->tmp_dir = sys_get_temp_dir() . '/' . time();
    }

    /**
     * @return void
     */
    public function run()
    {
        foreach($this->findLibraryFiles() as $file)
        {
            $libraries = $this->parseLibraryFile($file);
            if($libraries)
            {
                $this->mergeLibraries($libraries);
            }
        }

        if(!$this->libraries)
        {
            echo "No libraries found\n";
            exit;
        }

        $this->prepareLibraryDirectory();
        $this->prepareTmpDirectory();

        foreach($this->libraries as $library)
        {
            $this->processLibrary($library);
        }

        $this->cleanUp();
    }

    /**
     * @return array
     */
    protected function findLibraryFiles(): array
    {
        $library_files = glob($this->modules_path . '/*/composer.libraries.json');
        return $library_files === false ? [] : $library_files;
    }

    /**
     * @param $file
     * @return array
     */
    protected function parseLibraryFile($file): array
    {
        $json = json_decode(file_get_contents($file));
        if(!isset($json->repositories)) return [];

        $libraries = [];
        foreach($json->repositories as $repo)
        {
            if(isset($repo->package->type) && $repo->package->type == 'drupal-library')
            {
                // Skip packages that use source (git) instead of dist (download)
                if(!isset($repo->package->dist))
                {
                    if($this->debug) echo "Skipping {$repo->package->name}: no dist URL (uses source).\n";
                    continue;
                }
                $libraries[] = $repo->package;
            }
        }
        return $libraries;
    }

    /**
     * Different modules could specify the same library, possibly different versions.
     * What's the correct thing to do? What does composer do?
     * We'll just choose the latest version and hope.
     *
     * @param $libraries
     * @return void
     */
    protected function getLibraryName(stdClass $library): ?string
    {
        if(isset($library->extra->{'installer-name'}))
        {
            return $library->extra->{'installer-name'};
        }
        // Fall back to package name (part after vendor/)
        if(isset($library->name) && strpos($library->name, '/') !== false)
        {
            return explode('/', $library->name, 2)[1];
        }
        return null;
    }

    protected function mergeLibraries($libraries)
    {
        foreach($libraries as $library)
        {
            $name = $this->getLibraryName($library);
            if(!$name)
            {
                if($this->debug) echo "Skipping library with no name.\n";
                continue;
            }
            if(isset($this->libraries[$name]))
            {
                $v1 = str_replace('v', '', $library->version);
                $v2 = str_replace('v', '', $this->libraries[$name]->version);
                if(version_compare($v1, $v2, 'gt'))
                {
                    $this->libraries[$name] = $library;
                }
            }
            else
            {
                $this->libraries[$name] = $library;
            }
        }
    }

    /**
     * @param stdClass $library
     * @return false|void
     */
    protected function processLibrary(stdClass $library)
    {
        $compressed_library = $this->downloadLibrary($library);
        if(!$compressed_library) return false;

        $uncompressed_library = $this->uncompressLibrary($library, $compressed_library);
        if(!$uncompressed_library) return false;

        $this->placeLibrary($library, $uncompressed_library);
    }

    /**
     * @param $library
     * @return false|string
     */
    protected function downloadLibrary($library)
    {
        $name = $this->getLibraryName($library);
        $where = $this->tmp_dir . '/' . $name;
        if(!mkdir($where, 0777, true)) return false;

        //the compressed file name
        $file_name = basename($library->dist->url);
        //the path to the downloaded compressed file
        $dist_file = "$where/$file_name";

        if($this->debug) echo "\ndownloading to $dist_file\n";

        $safe_dist = escapeshellarg($dist_file);
        $safe_url = escapeshellarg($library->dist->url);
        `curl --location --output {$safe_dist} {$safe_url}`;

        return file_exists($dist_file) ? $dist_file : false;
    }

    /**
     * @param stdClass $library
     * @param string $compressed_library
     * @return false|string
     */
    protected function uncompressLibrary(stdClass $library, string $compressed_library)
    {
        switch($library->dist->type)
        {
            case 'tar':
                $command = 'tar -xzf';
                break;
            case 'zip':
                $command = 'unzip -o';
                break;
            case 'file':
                return $compressed_library;
                break;
            default:
                $command = '';
        }
        if(!$command)
        {
            if($this->debug) echo "Not a compressed dist library.\n";
            return false;
        }

        $location = dirname($compressed_library);
        $compressed_file = basename($compressed_library);
        $safe_location = escapeshellarg($location);
        $safe_compressed_file = escapeshellarg($compressed_file);
        $safe_compressed_library = escapeshellarg($compressed_library);
        `cd {$safe_location} && {$command} {$safe_compressed_file} && rm {$safe_compressed_library}`;

        //try to figure out what the dist got expanded to
        //if there is a common file in the top directory, that's the library
        if(file_exists("{$location}/package.json") ||
            file_exists("{$location}/composer.json") ||
            file_exists("{$location}/LICENSE.md") ||
            file_exists("{$location}/README.md"))
        {
            $library_dir = $location;
        }
        else
        {
            //maybe it got expanded into a sub-directory
            $library_dir = $location . '/' . trim(strtok(trim(`ls -AUtm $location`), ','));
        }
        if($this->debug) echo "Library was expanded to {$library_dir}.\n";

        return $library_dir && is_dir($library_dir) ? $library_dir : false;
    }

    /**
     * @param stdClass $library
     * @param $expanded_library
     * @return void
     */
    protected function placeLibrary(stdClass $library, $expanded_library)
    {
        $name = $this->getLibraryName($library);
        $library_name = $library->dist->type == 'file'
            ? basename($library->dist->url)
            : $name;

        //its versioned, something like "tippyjs/5.x"
        if(strpos($name, '/') !== false)
        {
            mkdir("{$this->libraries_path}/{$name}", 0755, true);
        }

        $target = "{$this->libraries_path}/{$library_name}";

        // Remove existing directory so mv doesn't fail
        if(is_dir($target))
        {
            $safe_target = escapeshellarg($target);
            `rm -rf {$safe_target}`;
        }

        if($this->debug) echo "Moving {$expanded_library} to {$target}.\n";
        $safe_src = escapeshellarg($expanded_library);
        $safe_dest = escapeshellarg($target);
        `mv {$safe_src} {$safe_dest}`;
    }

    protected function cleanUp()
    {
        if(is_dir($this->tmp_dir))
        {
            $safe_dir = escapeshellarg($this->tmp_dir);
            `rm -rf {$safe_dir}`;
        }
    }

    /**
     * @return bool
     */
    protected function prepareLibraryDirectory(): bool
    {
        if(is_dir($this->libraries_path) && is_writable($this->libraries_path))
        {
            return true;
        }

        return mkdir($this->libraries_path, 0755);
    }

    /**
     * @return bool
     */
    protected function prepareTmpDirectory(): bool
    {
        if(is_dir($this->tmp_dir) && is_writable($this->tmp_dir))
        {
            return true;
        }

        return mkdir($this->tmp_dir);
    }
}

(new LibraryInstaller())->run();