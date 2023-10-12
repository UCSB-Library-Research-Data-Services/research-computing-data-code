<?php

namespace Drupal\ckeditor_ucsbicon\Plugin\CKEditorPlugin;

use Drupal\ckeditor\CKEditorPluginBase;
use Drupal\editor\Entity\Editor;

/**
 * Defines the "UCSB Icon" plugin.
 *
 * @CKEditorPlugin(
 *   id = "ucsbicon",
 *   label = @Translation("UCSB Icon"),
 *   module = "ckeditor_ucsbicon"
 * )
 */
class UCSBIcon extends CKEditorPluginBase {

  /**
   * {@inheritdoc}
   */
  public function getFile() {
    if ($library_path = \Drupal::service('extension.list.module')->getPath('ckeditor_ucsbicon')) {
      return $library_path . '/ucsbicon/plugin.js';
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
      'ckeditor_ucsbicon/style',
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
      'ucsbicon' => [
        'label' => t('UCSB Icon'),
        'image' => \Drupal::service('extension.list.module')->getPath('ckeditor_ucsbicon') . '/ucsbicon/icons/icon.png',
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