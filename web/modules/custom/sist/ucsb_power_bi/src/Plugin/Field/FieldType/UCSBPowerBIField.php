<?php

namespace Drupal\ucsb_power_bi\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\TypedData\DataDefinition;

/**
 * Class UCSBPowerBIField.
 *
 * @FieldType(
 *   id = "ucsb_power_bi",
 *   module = "ucsb_power_bi",
 *   label = @Translation("PowerBI report"),
 *   category = @Translation("Reference"),
 *   description = @Translation("This field type stores PowerBI report reference information."),
 *   default_widget = "ucsb_power_bi_widget",
 *   default_formatter = "ucsb_power_bi_formatter",
 *   column_groups = {
 *     "report_id" = {
 *       "label" = @Translation("Report ID"),
 *       "translatable" = TRUE
 *     },
 *     "workspace_id" = {
 *       "label" = @Translation("Workspace ID"),
 *       "translatable" = TRUE
 *     },
 *     "dataset_id" = {
 *       "label" = @Translation("Dataset ID"),
 *       "translatable" = TRUE
 *     },
 *     "role" = {
 *       "label" = @Translation("Role"),
 *       "translatable" = TRUE
 *     },
 *     "report_width" = {
 *       "label" = @Translation("Report width"),
 *       "translatable" = TRUE
 *     },
 *     "report_height" = {
 *       "label" = @Translation("Report height"),
 *       "translatable" = TRUE
 *     },
 *     "report_title" = {
 *       "label" = @Translation("Report title"),
 *       "translatable" = TRUE
 *     },
 *   },
 * )
 */
class UCSBPowerBIField extends FieldItemBase {

  /**
   * {@inheritDoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {

    $properties = [];

    $properties['report_id'] = DataDefinition::create('string')
      ->setLabel(t('Report ID'))
      ->setDescription(t('PowerBI Report ID'));

    $properties['workspace_id'] = DataDefinition::create('string')
      ->setLabel(t('Workspace ID'))
      ->setDescription(t('PowerBI Workspace ID'));

    $properties['dataset_id'] = DataDefinition::create('string')
      ->setLabel(t('Dataset ID'))
      ->setDescription(t('PowerBI Dataset ID (optional)'));

    $properties['role'] = DataDefinition::create('string')
      ->setLabel(t('Role'))
      ->setDescription(t('PowerBI Role (optional)'));

    $properties['report_width'] = DataDefinition::create('float')
      ->setLabel(t('Report width'))
      ->setDescription(t('PowerBI Report width (must be entered in pixels with only digits)'));

    $properties['report_height'] = DataDefinition::create('float')
      ->setLabel(t('Report height'))
      ->setDescription(t('PowerBI Report height (must be entered in pixels with only digits)'));

    $properties['report_title'] = DataDefinition::create('string')
      ->setLabel(t('Report title'))
      ->setDescription(t('PowerBI Report title'));

    return $properties;
  }

  /**
   * {@inheritDoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    $columns = [
      'report_id' => [
        'type' => 'varchar',
        'length' => 1024,
      ],
      'workspace_id' => [
        'type' => 'varchar',
        'length' => 1024,
      ],
      'dataset_id' => [
        'type' => 'varchar',
        'length' => 1024,
      ],
      'role' => [
        'type' => 'varchar',
        'length' => 1024,
      ],
      'report_height' => [
        'type' => 'float',
      ],
      'report_width' => [
        'type' => 'float',
      ],
      'report_title' => [
        'type' => 'varchar',
        'length' => 1024,
      ],
    ];

    $schema = [
      'columns' => $columns,
      'indexes' => [],
    ];

    return $schema;
  }

  /**
   * {@inheritDoc}
   */
  public function isEmpty() {
    $value = $this->get('report_id')->getValue();

    return $value === NULL;
  }

}
