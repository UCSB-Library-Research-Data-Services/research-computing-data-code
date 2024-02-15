<?php

namespace Drupal\ssis_news\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Config\ConfigFactory;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\Element\EntityAutocomplete;


/**
 * Class DefaultNewsPageForm.
 */
class DefaultNewsPageForm extends ConfigFormBase {

  /**
   * The node storage.
   *
   * @var \Drupal\node\NodeStorage
   */
  protected $nodeStorage;
  /**
   * {@inheritdoc}
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager)
  {
    $this->nodeStorage = $entity_type_manager->getStorage('node');
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container)
  {
    return new static(
      $container->get('entity_type.manager')
    );
  }
  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames(){
    return ['ssis_news.settings'];
  }
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'default_news_page_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('ssis_news.settings');


    $nodeEntity = \Drupal::service('entity_display.repository');

    //Create a form element for listing the view options
    $ViewModeOptions = array();
    $ViewModeOptions = $nodeEntity->getViewModeOptionsByBundle('node','ssis_news');
    $form['type_options'] = array(
      '#type' => 'value',
      '#value' => $ViewModeOptions
    );

    $form['default_news_page_view_mode'] = [
      '#type' => 'select',
      '#title' => $this->t('Default News Page View Mode'),
      '#description' => $this->t('Use this option to specify which view_mode (template) would be used for rendering the full content of the news article. Please note that this change would trigger cache rebuild'),
      '#default_value' => $config->get('default_news_page_view_mode'),
      '#options' => $form['type_options']['#value'],
      '#size' => 1,
      '#weight' => '0',
    ];

    //Create a form element for listing the form display options
    $FormDisplayModeOptions = array();
    $FormDisplayModeOptions = $nodeEntity->getFormModeOptionsByBundle('node', 'ssis_news');
    $form['form_type_options'] = array(
      '#type' => 'value',
      '#value' => $FormDisplayModeOptions
    );


    $form['default_news_form_display_mode'] = [
      '#type' => 'select',
      '#title' => $this->t('Default News Form Display Mode'),
      '#description' => $this->t('Use this option to specify which display_mode (template) would be used for rendering the forms of the news article. Please note that this change would trigger cache rebuild'),
      '#default_value' => $config->get('default_news_form_display_mode'),
      '#options' => $form['form_type_options']['#value'],
      '#size' => 1,
      '#weight' => '0',
    ];


    //Create a form element for selecting the root page
    $form['default_parent_page'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Default URL Root'),
      '#description' => $this->t('Use this option to specify custom URL path.'),
      '#autocomplete_route_name' => 'ssis_news.autocomplete.load_pages',
      '#default_value' => $config->get('default_parent_page'),
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Save Configuration'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    foreach ($form_state->getValues() as $key => $value) {
      // @TODO: Validate fields.
    }
    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state)
  {
    // Save the default view mode
    $this->config('ssis_news.settings')->set('default_news_page_view_mode',$form_state->getValue('default_news_page_view_mode'));
    // Save the default form display mode
    $this->config('ssis_news.settings')->set('default_news_form_display_mode', $form_state->getValue('default_news_form_display_mode'));
    // Save the default root URL route
    $this->config('ssis_news.settings')->set('default_parent_page', $form_state->getValue('default_parent_page'));

    $this->config('ssis_news.settings')->save();
    \Drupal::messenger()->addMessage('Configuration has been saved and cache has been rebuild.');

    drupal_flush_all_caches();
  }

}
