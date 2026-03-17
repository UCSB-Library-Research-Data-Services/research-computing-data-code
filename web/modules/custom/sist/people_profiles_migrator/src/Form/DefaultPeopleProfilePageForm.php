<?php

namespace Drupal\people_profiles_migrator\Form;

use Drupal\people_profiles\Form\DefaultPeopleProfilePageForm as BaseDefaultPeopleProfilePageForm;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\migrate\Plugin\MigrationPluginManagerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Extended default people profile page settings form with migration features.
 */
class DefaultPeopleProfilePageForm extends BaseDefaultPeopleProfilePageForm {

  /**
   * The migration plugin manager.
   *
   * @var \Drupal\migrate\Plugin\MigrationPluginManagerInterface
   */
  protected $migrationPluginManager;

  /**
   * Constructs a DefaultPeopleProfilePageForm object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\migrate\Plugin\MigrationPluginManagerInterface $migration_plugin_manager
   *   The migration plugin manager.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, MigrationPluginManagerInterface $migration_plugin_manager) {
    parent::__construct($entity_type_manager);
    $this->migrationPluginManager = $migration_plugin_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('plugin.manager.migration')
    );
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['people_profiles.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'people_profiles_migrator_default_people_profile_page_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    // Get the parent form first
    $form = parent::buildForm($form, $form_state);
    $config = $this->config('people_profiles.settings');

    // Remove the parent submit button since we'll add our own
    unset($form['submit']);

    // Debug: Show current migration URLs
    $current_migration_urls = $this->getCurrentMigrationUrls();

    $form['external_url'] = [
      '#type' => 'url',
      '#title' => $this->t('External Source URL'),
      '#description' => $this->t('Enter an external URL to override the default source.urls value in all SSIS people migrations (profiles, photos, CVs, and avatars).<br/><i>The format of the URL should be https://source-site-url/people_profile_feed.xml</i><br/><strong>Current migration URL(s):</strong> @urls', [
        '@urls' => $current_migration_urls ? implode(', ', $current_migration_urls) : 'Not found'
      ]),
      '#default_value' => $config->get('ssis_external_source_url'),
      '#maxlength' => 2048,
      '#required' => TRUE,
      '#weight' => 10,
    ];

    $form['cron_settings'] = [
      '#type' => 'details',
      '#title' => $this->t('Cron Job Settings'),
      '#open' => TRUE,
      '#weight' => 20,
    ];

    $form['cron_settings']['enable_cron'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable scheduled migration'),
      '#description' => $this->t('Enable automatic execution of all SSIS people migrations (profiles, photos, CVs, and avatars) via cron.'),
      '#default_value' => $config->get('ssis_cron_enabled'),
    ];

    $form['cron_settings']['cron_interval'] = [
      '#type' => 'select',
      '#title' => $this->t('Migration frequency'),
      '#description' => $this->t('How often should the migration run automatically?'),
      '#options' => [
        3600 => $this->t('Every hour'),
        21600 => $this->t('Every 6 hours'),
        43200 => $this->t('Every 12 hours'),
        86400 => $this->t('Daily'),
        604800 => $this->t('Weekly'),
      ],
      '#default_value' => $config->get('ssis_cron_interval') ?? 86400,
      '#states' => [
        'visible' => [
          ':input[name="enable_cron"]' => ['checked' => TRUE],
        ],
      ],
    ];

    $form['cron_settings']['last_run'] = [
      '#type' => 'item',
      '#title' => $this->t('Last migration run'),
      '#markup' => $this->getLastRunTime(),
    ];

    $form['migration_actions'] = [
      '#type' => 'details',
      '#title' => $this->t('Manual Migration Actions'),
      '#open' => FALSE,
      '#weight' => 30,
    ];

    $form['migration_actions']['run_migration'] = [
      '#type' => 'submit',
      '#value' => $this->t('Run All Migrations Now'),
      '#submit' => ['::runMigrationNow'],
      '#button_type' => 'primary',
    ];

    $form['migration_actions']['reset_migration'] = [
      '#type' => 'submit',
      '#value' => $this->t('Reset All Migrations'),
      '#submit' => ['::resetMigration'],
      '#attributes' => [
        'onclick' => 'return confirm("' . $this->t('Are you sure you want to reset all migrations? This will remove all imported people profiles, photos, CVs, and avatars.') . '")',
      ],
    ];

    // Add our save configuration button
    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Save Configuration'),
      '#weight' => 40,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);

    $external_url = $form_state->getValue('external_url');
    if (!empty($external_url)) {
      if (!filter_var($external_url, FILTER_VALIDATE_URL)) {
        $form_state->setErrorByName('external_url', $this->t('Please enter a valid URL.'));
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Handle our additional configuration first
    $config = $this->configFactory()->getEditable('people_profiles.settings');
    
    // Call parent submit to handle existing functionality 
    // but skip the cache flush since we'll do it properly
    $config->set('default_people_profiles_page_view_mode', $form_state->getValue('default_people_profiles_page_view_mode'))
      ->set('default_people_profiles_form_display_mode', $form_state->getValue('default_people_profiles_form_display_mode'))
      ->set('ssis_external_source_url', $form_state->getValue('external_url'))
      ->set('ssis_cron_enabled', $form_state->getValue('enable_cron'))
      ->set('ssis_cron_interval', $form_state->getValue('cron_interval'))
      ->save();

    // Update migration configuration if external URL is provided
    $this->updateMigrationConfiguration($form_state->getValue('external_url'));

    // Proper cache clearing instead of the deprecated drupal_flush_all_caches()
    \Drupal::service('cache_tags.invalidator')->invalidateTags(['config:people_profiles.settings']);
    \Drupal::service('cache_tags.invalidator')->invalidateTags(['rendered']);
    \Drupal::service('cache_tags.invalidator')->invalidateTags(['node_list']);
    \Drupal::service('cache_tags.invalidator')->invalidateTags(['node_view']);

    
    drupal_flush_all_caches();

    $this->messenger()->addMessage($this->t('Configuration has been saved and cache has been rebuilt.'));
  }

  /**
   * Submit handler for running migration immediately.
   */
  public function runMigrationNow(array &$form, FormStateInterface $form_state) {
    $external_url = $form_state->getValue('external_url');
    
    // Update migration configuration before running
    $this->updateMigrationConfiguration($external_url);
    
    try {
      // Get all migrations in the ssis_people group
      $migration_ids = ['ssis_people_cv_media', 'ssis_people_photos_media', 'ssis_people_avatar_media', 'ssis_people_profiles'];
      $successful_migrations = 0;
      $total_migrations = count($migration_ids);
      
      foreach ($migration_ids as $migration_id) {
        try {
          /** @var \Drupal\migrate\Plugin\MigrationInterface $migration */
          $migration = $this->migrationPluginManager->createInstance($migration_id);
          
          if ($migration) {
            // For YAML-based migrations, manually override the source URLs if external URL is provided
            if (!empty($external_url)) {
              $source_config = $migration->getSourceConfiguration();
              $source_config['urls'] = [$external_url];
              
              // Create a new migration instance with updated source configuration
              $migration_definition = $migration->getPluginDefinition();
              $migration_definition['source'] = $source_config;
              
              // Create a new migration instance with the updated definition
              $migration = $this->migrationPluginManager->createInstance($migration_id, $migration_definition);
            }
            
            // Debug: Check what URL the migration is actually using
            $source_config = $migration->getSourceConfiguration();
            if (isset($source_config['urls'])) {
              $current_urls = is_array($source_config['urls']) ? implode(', ', $source_config['urls']) : $source_config['urls'];
              $this->messenger()->addStatus($this->t('Migration @id will use URL(s): @urls', [
                '@id' => $migration_id,
                '@urls' => $current_urls
              ]));
            }
            
            // Check if migrate_tools is available
            if (class_exists('\Drupal\migrate_tools\MigrateExecutable')) {
              $executable = new \Drupal\migrate_tools\MigrateExecutable($migration, new \Drupal\migrate\MigrateMessage());
            } else {
              // Fallback to core migrate executable
              $executable = new \Drupal\migrate\MigrateExecutable($migration, new \Drupal\migrate\MigrateMessage());
            }
            
            // Enable update mode by clearing the migration's processed items
            // This forces the migration to re-process all items instead of skipping processed ones
            $migration->getIdMap()->prepareUpdate();
            
            $result = $executable->import();
            
            if ($result == MigrationInterface::RESULT_COMPLETED) {
              $successful_migrations++;
              $this->messenger()->addMessage($this->t('Migration @id completed successfully.', ['@id' => $migration_id]));
            } else {
              $this->messenger()->addWarning($this->t('Migration @id completed with some issues. Check the logs for details.', ['@id' => $migration_id]));
            }
          }
        } catch (\Exception $e) {
          $this->messenger()->addError($this->t('Migration @id failed: @error', [
            '@id' => $migration_id,
            '@error' => $e->getMessage()
          ]));
        }
      }
      
      // Update last run time using State API
      \Drupal::state()->set('people_profiles_migrator.last_run', \Drupal::time()->getRequestTime());
      
      // Summary message
      if ($successful_migrations == $total_migrations) {
        $this->messenger()->addMessage($this->t('All @total migrations completed successfully!', ['@total' => $total_migrations]));
      } else {
        $this->messenger()->addMessage($this->t('@successful of @total migrations completed successfully.', [
          '@successful' => $successful_migrations,
          '@total' => $total_migrations
        ]));
      }
      
    } catch (\Exception $e) {
      $this->messenger()->addError($this->t('Migration process failed: @error', ['@error' => $e->getMessage()]));
    }
  }

  /**
   * Submit handler for resetting migration.
   */
  public function resetMigration(array &$form, FormStateInterface $form_state) {
    try {
      // Get all migrations in the ssis_people group (reverse order for dependencies)
      $migration_ids = ['ssis_people_avatar_media', 'ssis_people_photos_media', 'ssis_people_cv_media', 'ssis_people_profiles'];
      $successful_resets = 0;
      $total_migrations = count($migration_ids);
      
      foreach ($migration_ids as $migration_id) {
        try {
          /** @var \Drupal\migrate\Plugin\MigrationInterface $migration */
          $migration = $this->migrationPluginManager->createInstance($migration_id);
          
          if ($migration) {
            // Check if migrate_tools is available
            if (class_exists('\Drupal\migrate_tools\MigrateExecutable')) {
              $executable = new \Drupal\migrate_tools\MigrateExecutable($migration, new \Drupal\migrate\MigrateMessage());
            } else {
              // Fallback to core migrate executable
              $executable = new \Drupal\migrate\MigrateExecutable($migration, new \Drupal\migrate\MigrateMessage());
            }
            
            $executable->rollback();
            $successful_resets++;
            $this->messenger()->addMessage($this->t('Migration @id has been reset.', ['@id' => $migration_id]));
          }
        } catch (\Exception $e) {
          $this->messenger()->addError($this->t('Migration @id reset failed: @error', [
            '@id' => $migration_id,
            '@error' => $e->getMessage()
          ]));
        }
      }
      
      // Summary message
      if ($successful_resets == $total_migrations) {
        $this->messenger()->addMessage($this->t('All @total migrations have been reset successfully! All imported people profiles and media have been removed.', ['@total' => $total_migrations]));
      } else {
        $this->messenger()->addMessage($this->t('@successful of @total migrations were reset successfully.', [
          '@successful' => $successful_resets,
          '@total' => $total_migrations
        ]));
      }
      
    } catch (\Exception $e) {
      $this->messenger()->addError($this->t('Migration reset process failed: @error', ['@error' => $e->getMessage()]));
    }
  }

  /**
   * Update the migration configuration with the external URL.
   *
   * @param string $external_url
   *   The external URL to use as source.
   */
  protected function updateMigrationConfiguration($external_url) {
    try {
      // For YAML-based migrations, we need to modify the definition directly
      if (!empty($external_url)) {
        // Clear the migration plugin cache first
        \Drupal::service('plugin.manager.migration')->clearCachedDefinitions();
        
        $this->messenger()->addStatus($this->t('Migration source URL will be updated to: @url', ['@url' => $external_url]));
      } else {
        // Clear cache to reset to original URLs
        \Drupal::service('plugin.manager.migration')->clearCachedDefinitions();
        $this->messenger()->addStatus($this->t('Migration source URL will be reset to original configuration.'));
      }
      
    } catch (\Exception $e) {
      $this->messenger()->addError($this->t('Failed to update migration configuration: @error', ['@error' => $e->getMessage()]));
    }
  }

  /**
   * Get formatted last run time.
   *
   * @return string
   *   Formatted last run time or "Never" if not set.
   */
  protected function getLastRunTime() {
    $last_run = \Drupal::state()->get('people_profiles_migrator.last_run');
    if ($last_run) {
      return \Drupal::service('date.formatter')->format($last_run, 'medium');
    }
    return $this->t('Never');
  }

  /**
   * Get the original URLs from the migration YAML definition.
   *
   * @return array|null
   *   The original URLs or NULL if not found.
   */
  protected function getOriginalMigrationUrls() {
    try {
      // Try to get the original definition from the YAML file
      $migration_definition = $this->migrationPluginManager->getDefinition('ssis_people_profiles');
      return $migration_definition['source']['urls'] ?? NULL;
    } catch (\Exception $e) {
      return NULL;
    }
  }

  /**
   * Get the current URLs from the migration configuration.
   *
   * @return array|null
   *   The current URLs or NULL if not found.
   */
  protected function getCurrentMigrationUrls() {
    try {
      // First check if we have an external URL configured
      $config = $this->config('people_profiles.settings');
      $external_url = $config->get('ssis_external_source_url');
      
      if (!empty($external_url)) {
        return [$external_url];
      }
      
      // Fallback to original migration definition
      return $this->getOriginalMigrationUrls();
    } catch (\Exception $e) {
      return NULL;
    }
  }

}
