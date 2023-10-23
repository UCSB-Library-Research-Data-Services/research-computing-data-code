<?php

namespace Drupal\ckeditor_ucsbbutton\Plugin\CKEditorPlugin;

use Drupal\ckeditor\CKEditorPluginBase;
use Drupal\editor\Entity\Editor;

/**
 * Defines the "UCSB Button" plugin.
 *
 * @CKEditorPlugin(
 *   id = "ucsbbutton",
 *   label = @Translation("UCSB Button"),
 *   module = "ckeditor_ucsbbutton"
 * )
 */
class UCSBButton extends CKEditorPluginBase {

  /**
   * {@inheritdoc}
   */
  public function getFile() {
    if ($library_path = \Drupal::service('extension.list.module')->getPath('ckeditor_ucsbbutton')) {
      return $library_path . '/ucsbbutton/plugin.js';
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getDependencies(Editor $editor) {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function getLibraries(Editor $editor) {
    $libraries = [
      'ckeditor_ucsbbutton/style',
    ];

    return $libraries;
  }

  /**
   * {@inheritdoc}
   */
  public function isInternal() {
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function getButtons() {
    return [
      'ucsbbutton' => [
        'label' => t('UCSB Button'),
        'image' => \Drupal::service('extension.list.module')->getPath('ckeditor_ucsbbutton') . '/ucsbbutton/icons/button.png',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function isEnabled(Editor $editor) {
  }

  /**
   * {@inheritdoc}
   */
  public function getConfig(Editor $editor) {
    return [];
  }

}