<?php

namespace Drupal\ucsb_power_bi\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configure settings for PowerBI Embed.
 */
class UCSBPowerBISettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'ucsb_power_bi_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'ucsb_power_bi.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('ucsb_power_bi.settings');
    $secret = \Drupal::state()->get('power_bi_secret');

    $form['client_id'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Client ID'),
      '#description' => $this->t('PowerBI Client ID'),
      '#default_value' => empty($config->get('client_id')) ? '' : $config->get('client_id'),
    ];

    $form['tenant_id'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Tenant ID'),
      '#description' => $this->t('PowerBI Tenant ID'),
      '#default_value' => empty($config->get('tenant_id')) ? '' : $config->get('tenant_id'),
    ];

    $form['secret'] = [
      '#type' => 'password',
      '#title' => $this->t('PowerBI secret'),
      '#description' => $this->t('PowerBI Secret'),
      '#default_value' => empty($secret) ? '' : $secret,
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->config('ucsb_power_bi.settings');
    $config->set('client_id', $form_state->getValue('client_id'));
    $config->set('tenant_id', $form_state->getValue('tenant_id'));
    if (!empty($form_state->getValue('secret'))) {
      $secret = \Drupal::state()->set('power_bi_secret', $form_state->getValue('secret'));
    }
    $config->save();

    return parent::submitForm($form, $form_state);
  }

}
