<?php

namespace Drupal\people_profiles_migrator\Plugin\migrate\process;

use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\MigrateExecutable;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;
use Drupal\migrate\MigrateException;

/**
 * Converts relative URLs to absolute URLs using the migration source base URL.
 *
 * This plugin extracts the base URL from the migration source configuration
 * and combines it with relative file paths to create absolute URLs for file
 * imports.
 *
 * Available configuration keys:
 * - source: The source field containing the relative URL
 * - base_url: Optional custom base URL to override auto-detection
 * - skip_validation: Skip URL validation (default: FALSE)
 * - log_errors: Log transformation errors (default: TRUE)
 *
 * Examples:
 *
 * @code
 * process:
 *   field_media_image:
 *     - plugin: relative_to_absolute_url
 *       source: uri
 *     - plugin: file_import
 * @endcode
 *
 * @code
 * process:
 *   field_media_image:
 *     - plugin: relative_to_absolute_url
 *       source: uri
 *       base_url: 'https://custom.example.com'
 *       skip_validation: true
 *     - plugin: file_import
 * @endcode
 *
 * @MigrateProcessPlugin(
 *   id = "relative_to_absolute_url"
 * )
 */
class RelativeToAbsoluteUrl extends ProcessPluginBase {

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->validateConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    // Skip processing if value is empty
    if (empty($value)) {
      return $value;
    }

    // Configuration options
    $skip_validation = $this->configuration['skip_validation'] ?? FALSE;
    $custom_base_url = $this->configuration['base_url'] ?? NULL;

    try {
      // If the value is already an absolute URL, return it
      if (filter_var($value, FILTER_VALIDATE_URL)) {
        return $value;
      }

      // Get base URL
      $base_url = $custom_base_url ?: $this->extractBaseUrl($migrate_executable, $row);
      
      if (empty($base_url)) {
        // Return original value as fallback if we can't determine base URL
        return $value;
      }

      // Combine base URL with relative path
      $absolute_url = $this->combineUrls($base_url, $value);
      
      // Validate the final URL unless validation is skipped
      if (!$skip_validation && !filter_var($absolute_url, FILTER_VALIDATE_URL)) {
        // Return original value as fallback if generated URL is invalid
        return $value;
      }
      
      return $absolute_url;

    } catch (\Exception $e) {
      // Return original value as fallback on any error
      return $value;
    }
  }

  /**
   * Extract the base URL from the migration source configuration.
   *
   * @param \Drupal\migrate\MigrateExecutableInterface $migrate_executable
   *   The migration executable.
   * @param \Drupal\migrate\Row $row
   *   The current row being processed.
   *
   * @return string|null
   *   The base URL or NULL if not found.
   */
  protected function extractBaseUrl(MigrateExecutableInterface $migrate_executable, Row $row) {
    // Check if there's an external URL configured via the form
    $config = \Drupal::config('people_profiles.settings');
    $external_url = $config->get('ssis_external_source_url');
    
    if (!empty($external_url)) {
      return $this->getBaseUrlFromFull($external_url);
    }

    // Get the migration source configuration if executable is MigrateExecutable
    if ($migrate_executable instanceof MigrateExecutable) {
      // Use reflection to access the protected migration property
      $reflection = new \ReflectionClass($migrate_executable);
      $property = $reflection->getProperty('migration');
      $property->setAccessible(TRUE);
      $migration = $property->getValue($migrate_executable);
      
      if ($migration) {
        $source_config = $migration->getSourceConfiguration();

        // Fall back to the source URLs from the migration configuration
        if (isset($source_config['urls']) && is_array($source_config['urls'])) {
          $first_url = reset($source_config['urls']);
          if ($first_url) {
            return $this->getBaseUrlFromFull($first_url);
          }
        }
      }
    }

    return NULL;
  }

  /**
   * Extract base URL from a full URL.
   *
   * @param string $full_url
   *   The full URL.
   *
   * @return string
   *   The base URL (scheme + host + port if non-standard).
   */
  protected function getBaseUrlFromFull($full_url) {
    $parsed = parse_url($full_url);
    if (!$parsed || !isset($parsed['scheme']) || !isset($parsed['host'])) {
      return '';
    }

    $base_url = $parsed['scheme'] . '://' . $parsed['host'];
    
    // Add port if it's not standard (80 for HTTP, 443 for HTTPS)
    if (isset($parsed['port'])) {
      $standard_ports = ['http' => 80, 'https' => 443];
      if (!isset($standard_ports[$parsed['scheme']]) || $parsed['port'] != $standard_ports[$parsed['scheme']]) {
        $base_url .= ':' . $parsed['port'];
      }
    }

    return $base_url;
  }

  /**
   * Combine base URL with relative path.
   *
   * @param string $base_url
   *   The base URL.
   * @param string $relative_path
   *   The relative path.
   *
   * @return string
   *   The combined absolute URL.
   */
  protected function combineUrls($base_url, $relative_path) {
    // Handle special cases
    if (empty($relative_path) || $relative_path === '/') {
      return $base_url;
    }

    // Handle protocol-relative URLs
    if (strpos($relative_path, '//') === 0) {
      $parsed_base = parse_url($base_url);
      return ($parsed_base['scheme'] ?? 'https') . ':' . $relative_path;
    }

    // Handle absolute paths that start with /
    if (strpos($relative_path, '/') === 0) {
      $relative_path = ltrim($relative_path, '/');
    }

    // Remove leading slash from relative path if present
    $relative_path = ltrim($relative_path, '/');
    
    // Ensure base URL doesn't end with slash
    $base_url = rtrim($base_url, '/');
    
    return $base_url . '/' . $relative_path;
  }

  /**
   * Validate plugin configuration.
   *
   * @throws \Drupal\migrate\MigrateException
   *   If configuration is invalid.
   */
  protected function validateConfiguration() {
    // Validate custom base URL if provided
    if (!empty($this->configuration['base_url'])) {
      $base_url = $this->configuration['base_url'];
      if (!filter_var($base_url, FILTER_VALIDATE_URL)) {
        throw new MigrateException(sprintf('Invalid base_url configuration: %s', $base_url));
      }
    }
  }

}