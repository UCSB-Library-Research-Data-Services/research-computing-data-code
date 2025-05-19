<?php

/**
 * @file
 * Builds placeholder replacement tokens for node-related data.
 */

use Drupal\Core\Render\BubbleableMetadata;

/**
 * Implements hook_token_info().
 */
function people_profiles_token_info()
{
    $type = [
        'name' => t('SSIS People Profiles Settings'),
        'description' => t('Tokens for SSIS People Profiles Settings and Labels.'),
    ];

    $people_profiles['default-parent-page'] = [
        'name' => t("Parent Page URL"),
        'description' => t("The Parent Page URL that has been configured."),
    ];

    return [
        'types' => ['people_profiles' => $type],
        'tokens' => [
            'people_profiles' => $people_profiles,
        ],
    ];
}



/**
 * Implements hook_tokens().
 */
function people_profiles_tokens($type, $tokens, array $data, array $options, \Drupal\Core\Render\BubbleableMetadata $bubbleable_metadata)
{
    $replacements = [];

    if ($type == 'people_profiles' && (!empty($data['node']) || !empty($data['term']))) {
        foreach ($tokens as $name => $original) {
            switch ($name) {
                case 'default-parent-page':
                    $default_parent_page = \Drupal::config('people_profiles.settings')->get('default_parent_page');
                    if($default_parent_page) {
                        $url = \Drupal\Core\Url::fromUserInput($default_parent_page);
                        $replacements[$original] = $url->toString();
                    }
                    else {
                        $replacements[$original] = "";
                    }
                    break;
            }
        }
    }
    return $replacements;
}