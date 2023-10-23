<?php

namespace Drupal\ucsb_power_bi\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'NameFieldTypeDefaultWidget' widget.
 *
 * @FieldWidget(
 *   id = "ucsb_power_bi_widget",
 *   label = @Translation("PowerBI Embed report reference"),
 *   description = @Translation("Use to reference PowerBI Embed report"),
 *   field_types = {
 *     "ucsb_power_bi",
 *   }
 * )
 */
class UCSBPowerBIWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {

    $element += [
      '#type' => 'fieldset',
    ];

    $element['report_id'] = [
      '#type' => 'textfield',
      '#title' => t('Report ID'),
      '#description' => t('PowerBI Report ID'),
      '#default_value' => isset($items[$delta]->report_id) ? $items[$delta]->report_id : NULL,
      '#size' => 255,
    ];
    
    $element['workspace_id'] = [
      '#type' => 'textfield',
      '#title' => t('Workspace ID'),
      '#description' => t('PowerBI Workspace ID'),
      '#default_value' => isset($items[$delta]->workspace_id) ? $items[$delta]->workspace_id : NULL,
      '#size' => 255,
    ];

    $element['dataset_id'] = [
      '#type' => 'textfield',
      '#title' => t('Dataset ID'),
      '#description' => t('PowerBI Dataset ID (optional)'),
      '#default_value' => isset($items[$delta]->dataset_id) ? $items[$delta]->dataset_id : NULL,
      '#size' => 255,
    ];

    $element['role'] = [
      '#type' => 'textfield',
      '#title' => t('Role'),
      '#description' => t('PowerBI Role (optional)'),
      '#default_value' => isset($items[$delta]->role) ? $items[$delta]->role : NULL,
      '#size' => 255,
    ];
    
    $element['report_width'] = [
      '#type' => 'textfield',
      '#title' => t('Report width'),
      '#description' => t('PowerBI Report width (must be entered in pixels with only digits)'),
      '#default_value' => isset($items[$delta]->report_width) ? $items[$delta]->report_width : 0,
      '#size' => 255,
      '#element_validate' => array(
        array($this, 'validateNumber'),
      ),
    ];

    $element['report_height'] = [
      '#type' => 'textfield',
      '#title' => t('Report height'),
      '#description' => t('PowerBI Report height (must be entered in pixels with only digits)'),
      '#default_value' => isset($items[$delta]->report_height) ? $items[$delta]->report_height : 0,
      '#size' => 255,
      '#element_validate' => array(
        array($this, 'validateNumber'),
      ),
    ];

    $element['report_title'] = [
      '#type' => 'textfield',
      '#title' => t('Report title'),
      '#description' => t('PowerBI Report title'),
      '#default_value' => isset($items[$delta]->report_title) ? $items[$delta]->report_title : NULL,
      '#size' => 255,
    ];

    return $element;
  }

  /**
   * Validate the color text field.
   */
  public static function validateNumber($element, FormStateInterface $form_state) {
    $value = $element['#value'];
    if ( !is_numeric($value) ) {
      $form_state->setError($element, t("Data entered was not numeric."));
    }
  }

}
