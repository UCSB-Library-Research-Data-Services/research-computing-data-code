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
    protected function mergeLibraries($libraries)
    {
        foreach($libraries as $library)
        {
            $name = $library->extra->{'installer-name'};
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
        $where = $this->tmp_dir . '/' . $library->extra->{'installer-name'};
        if(!mkdir($where, 0777, true)) return false;

        //the compressed file name
        $file_name = basename($library->dist->url);
        //the path to the downloaded compressed file
        $dist_file = "$where/$file_name";

        if($this->debug) echo "\ndownloading to $dist_file\n";

        `curl --location --output {$dist_file} {$library->dist->url}`;

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
        `cd {$location} && {$command} {$compressed_file} && rm {$compressed_library}`;

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
        $library_name = $library->dist->url == 'file'
            ? basename($library->dist->url)
            : $library->extra->{'installer-name'};

        //its versioned, something like "tippyjs/5.x"
        if(strpos($library->extra->{'installer-name'}, '/') !== false)
        {
            $path = $library->extra->{'installer-name'};
            mkdir("{$this->libraries_path}/{$path}", 0755, true);
        }

        if($this->debug) echo "Moving {$expanded_library} to {$this->libraries_path}/{$library_name}.\n";
        `mv {$expanded_library} {$this->libraries_path}/{$library_name}`;
    }

    protected function cleanUp()
    {
        @rmdir($this->tmp_dir);
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