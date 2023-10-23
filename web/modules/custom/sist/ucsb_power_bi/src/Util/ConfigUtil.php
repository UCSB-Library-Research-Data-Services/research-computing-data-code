<?php

namespace Drupal\ucsb_power_bi\Util;

/**
 * Configuration interface class for ucsb_power_bi module.
 */
class ConfigUtil {

  /**
   * Return PowerBI configuration settings.
   */
  private static function getConfig() {
    return \Drupal::config('ucsb_power_bi.settings');
  }

  /**
   * Return PowerBI configured Azure Client ID.
   */
  public static function getClientID() {
    $config = self::getConfig();
    return $config->get('client_id');
  }

  /**
   * Return PowerBI configured Workspace ID.
   */
  public static function getWorkspaceID() {
    $config = self::getConfig();
    return $config->get('tenant_id');
  }

  /**
   * Return PowerBI configured user name.
   */
  public static function getUsername() {
    $config = self::getConfig();
    return $config->get('username');
  }

  /**
   * Return PowerBI Token value.
   */
  public static function getPowerBIToken() {

    // Get token using a POST request.
    $tenant_id = self::getWorkspaceID();
    $post_params = [
      'accessLevel' => 'View',
      'allowSaveAs' => 'false',
    ];
    $curlPostToken = curl_init();
    $theCurlOpts = [
      CURLOPT_URL => 'https://login.windows.net/' . $tenant_id . '/oauth2/token',
      CURLOPT_RETURNTRANSFER => TRUE,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => [
        'grant_type' => 'client_credentials',
        'resource' => 'https://analysis.windows.net/powerbi/api',
        'client_id' => self::getClientID(),
        'client_secret' => \Drupal::state()->get('power_bi_secret'),
      ],
    ];
    curl_setopt_array($curlPostToken, $theCurlOpts);
    $tokenResponse = curl_exec($curlPostToken);
    $tokenError = curl_error($curlPostToken);
    curl_close($curlPostToken);

    // Decode result, and store the access_token in $embeddedToken variable:
    $token = '';
    if ($tokenError) {
      \Drupal::logger('ucsb_power_bi')->notice("cURL Error #:" . $tokenError);
    }
    else {
      $tokenResult = json_decode($tokenResponse, TRUE);
      \Drupal::logger('ucsb_power_bi')->notice('<pre><code>(success) Access Token: ' . print_r($tokenResult, TRUE) . '</code></pre>');
      if (isset($tokenResult) && is_array($tokenResult)) {
        $token = $tokenResult["access_token"];
      }
      else {
        \Drupal::logger('ucsb_power_bi')->notice("Token Error #:" . print_r($tokenResponse, TRUE));
      }
    }
    return $token;
  }

  /**
   * Return PowerBI embed token value.
   */
  public static function getPowerBIEmbedToken($token, $workspace_id, $report_id, $dataset_id, $role, $user_email) {

    // Create cURL POST request to generate PowerBI embed token.
    $powerbiAPIURL = 'https://api.powerbi.com/v1.0/myorg/groups/' . $workspace_id . '/reports/' . $report_id . '/GenerateToken';

    if (!empty($dataset_id)) {
      $post_params = [
        'accessLevel' => 'View',
        'allowSaveAs' => 'false',
        'identities' =>
          [
            0 =>
              [
                'username' => $user_email,
                'roles' =>
                  [
                    0 => $role,
                  ],
                'datasets' =>
                  [
                    0 => $dataset_id,
                  ],
              ],
          ],
      ];
    }
    else {
      $post_params = [
        'accessLevel' => 'View',
        'allowSaveAs' => 'false',
      ];
    }

    $payload = json_encode($post_params);
    $embeddedToken = "Authorization: Bearer " . $token;
    $curlGetUrl = curl_init();
    $theCurlOpts = [
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_URL => $powerbiAPIURL,
      CURLOPT_RETURNTRANSFER => TRUE,
      CURLOPT_ENCODING => '',
      CURLOPT_POSTFIELDS => $payload,
      CURLOPT_HTTPHEADER => [
        $embeddedToken,
        "Cache-Control: no-cache",
        "Content-Type: application/json",
      ],
    ];
    curl_setopt_array($curlGetUrl, $theCurlOpts);
    $embedResponse = curl_exec($curlGetUrl);
    $embedError = curl_error($curlGetUrl);
    curl_close($curlGetUrl);

    $embedUrl = '';
    $embedToken = '';
    if ($embedError) {
      \Drupal::logger('ucsb_power_bi')->notice("CURL Error #:" . $embedError);
    }
    else {
      $embedResponse = json_decode($embedResponse, TRUE);
      \Drupal::logger('ucsb_power_bi')->notice('<pre><code>(success) Embed Response (embed token): ' . print_r($embedResponse, TRUE) . '</code></pre>');
      if (isset($embedResponse['token'])) {
        $embedToken = $embedResponse['token'];
      }
    }
    return $embedToken;
  }

  /**
   * Return PowerBI embedded URL value.
   */
  public static function getPowerBIURL($token, $workspace_id, $report_id) {

    // Create cURL request to generate PowerBI embed URL.
    $powerbiAPIURL = 'https://api.powerbi.com/v1.0/myorg/groups/' . $workspace_id . '/reports/';
    $embeddedToken = "Authorization: Bearer " . $token;
    $curlGetUrl = curl_init();
    $theCurlOpts = [
      CURLOPT_URL => $powerbiAPIURL,
      CURLOPT_RETURNTRANSFER => TRUE,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'GET',
      CURLOPT_HTTPHEADER => [
        $embeddedToken,
        "Cache-Control: no-cache",
        "Content-Type: application/json",
      ],
    ];
    curl_setopt_array($curlGetUrl, $theCurlOpts);
    $embedResponse = curl_exec($curlGetUrl);
    $embedError = curl_error($curlGetUrl);
    curl_close($curlGetUrl);

    $embedUrl = '';
    if ($embedError) {
      \Drupal::logger('ucsb_power_bi')->notice("CURL Error #:" . $embedError);
    }
    else {
      $embedResponse = json_decode($embedResponse, TRUE);
      \Drupal::logger('ucsb_power_bi')->notice('<pre><code>Embed URL: ' . print_r($embedResponse, TRUE) . '</code></pre>');
      if (isset($embedResponse['value'][0]['embedUrl'])) {
        $embedUrl = $embedResponse['value'][0]['embedUrl'];
      }
    }
    return $embedUrl;
  }

}
