<?php

/**
 * @file
 * Builds placeholder replacement tokens for node-related data.
 */

use Drupal\Core\Render\BubbleableMetadata;

/**
 * Implements hook_token_info().
 */
function ssis_news_token_info()
{
    $type = [
        'name' => t('SSIS News Settings'),
        'description' => t('Tokens for SSIS News Settings and Labels.'),
    ];

    $ssis_news['default-parent-page'] = [
        'name' => t("Parent Page URL"),
        'description' => t("The Parent Page URL that has been configured."),
    ];

    return [
        'types' => ['ssis_news' => $type],
        'tokens' => [
            'ssis_news' => $ssis_news,
        ],
    ];
}



/**
 * Implements hook_tokens().
 */
function ssis_news_tokens($type, $tokens, array $data, array $options, \Drupal\Core\Render\BubbleableMetadata $bubbleable_metadata)
{
    $replacements = [];

    if ($type == 'ssis_news' && (!empty($data['node']) || !empty($data['term']))) {
        foreach ($tokens as $name => $original) {
            switch ($name) {
                case 'default-parent-page':
                    $default_parent_page = \Drupal::config('ssis_news.settings')->get('default_parent_page');
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