<?php

namespace Drupal\ucsb_power_bi\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\ucsb_power_bi\Util\ConfigUtil;

/**
 * Class UCSBPowerBIFieldFormatter.
 *
 * Plugin implementation of the 'ucsb_power_bi_formatter' formatter.
 *
 * @FieldFormatter(
 *   id = "ucsb_power_bi_formatter",
 *   label = @Translation("PowerBI Embed report"),
 *   field_types = {
 *     "ucsb_power_bi"
 *   }
 * )
 */
class UCSBPowerBIFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $element = [];
    //TODO - KWALL team - Add role, datasetID, email, etc as needed here and in the below template - provide those if not empty or null from the module, and provide them here to display based on items. 
    // Minimal inline twig template.
    $format_template = '<div id="reportContainer"></div><script>var models = window["powerbi-client"].models;var report=powerbi.embed(jQuery("#reportContainer").get(0),{type:"report",id:"{{report_id}}",tokenType: models.TokenType.Embed,accessToken:"{{token}}",embedUrl:"{{embed_url}}"});</script>';

    // Load inline twig template as file from module.
    $slash = DIRECTORY_SEPARATOR;
    $template_filename = 'field--ucsb-power-bi.html.twig';

    $module_handler = \Drupal::service('module_handler');
    $module_path = $module_handler->getModule('ucsb_power_bi')->getPath();
    $module_template_path = $module_path . $slash . 'templates' . $slash . $template_filename;
    if (is_readable($module_template_path)) {
      $module_format_template = file_get_contents($module_template_path);
      $format_template = $module_format_template;
    }

    // Check active theme for inline twig template file.
    $theme_handler = \Drupal::service('theme.manager');
    $theme_path = $theme_handler->getActiveTheme()->getPath();
    $theme_template_path = $theme_path . $slash . 'templates' . $slash . 'field' . $slash . $template_filename;
    if (is_readable($theme_template_path)) {
      $theme_format_template = file_get_contents($theme_template_path);
      $format_template = $theme_format_template;
    }

    // Get current route
    $route_name = \Drupal::routeMatch()->getRouteName();

    // Get current user info
    $current_user = \Drupal::currentUser();
    $user_email = '';
    if ($current_user->isAuthenticated()) {
      $user_email = $current_user->getEmail();
    }

    // Check for Access Power BI Report permission
    $allow_view_bi = $current_user->hasPermission('view power bi reports');

    // Generate PowerBI token
    $the_token = ConfigUtil::getPowerBIToken();

    foreach ($items as $delta => $item) {
      $embedToken =  ConfigUtil::getPowerBIEmbedToken($the_token, $item->workspace_id, $item->report_id, $item->dataset_id, $item->role, $user_email);
      \Drupal::logger('ucsb_power_bi-formatter')->notice('Embed token requested for... Workspace ID: ' . $item->workspace_id . ', Report ID: ' . $item->report_id . ', Dataset ID: ' . $item->dataset_id . ', Role: ' . $item->role . ', Email: ' . $user_email . ', Token: ' . $the_token);

      $the_url = ConfigUtil::getPowerBIURL($the_token, $item->workspace_id, $item->report_id);
      if(empty($the_url)) {
        $the_url = 'https://app.powerbi.com/reportEmbed';
      }
      $element[$delta] = [
        '#type' => 'inline_template',
        '#template' => $format_template,
        '#context' => [
          'allow_view_bi' => $allow_view_bi,
          'field_name' => $item->getParent()->getName(),
          'report_id' => $item->report_id,
          'report_width' => $item->report_width,
          'report_height' => $item->report_height,
          'report_title' => $item->report_title,
          'workspace_id' => $item->workspace_id,
          'dataset_id' => $item->dataset_id,
          'role' => $item->role,
          'token' => $embedToken,
          'embed_url' => $the_url,
          'route' => $route_name,
        ],
        '#cache' => [
          'max-age' => 0,
        ],
      ];
      \Drupal::logger('ucsb_power_bi-formatter')->notice('<pre><code>Element Delta: ' . print_r($element, TRUE) . '</code></pre>');
    }
    return $element;
  }

}
