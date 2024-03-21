# News module

This module creates a content types for managing news articles on the websites. Taxonomy terms are used for categorizing the articles providing color coding along with ability of setting a default thumbnails. The module comes with predefined views, and capability of setting up custom rendering per taxonomy/terms.
When rendering a news article teaser, the functionality will look for a thumbnail directly associated with the article, if it does not exist will check with the category, else it will assign the UCSB logo. There are multiple display modes styled and associated with the content type and in the configuration section there is a screen with options that allows administrators to specify the default form view for managing the articles, as well as display mode for rendering them. 
The module supplies a custom SSIS News Editor role for holding permissions for editing the news content.

## Dependencies

This module depends on the following modules:
  - content_moderation
  - menu_ui
  - media
  - media_library
  - node
  - path
  - scheduler
  - scheduler_content_moderation_integration
  - taxonomy
  - text
  - user
  - options
  - entity_browser
  - filter
  - system
  - toolbar
  - tvi

## Install

To install this module please use the following drush command

```bash
drush en ssis_news
```

## Usage

To use this content type, when logged in click on the News tab. At the top are some shortcuts with links to create a new article, manage categories, manage media and manage tags.
Specifying the default form and display modes can be done by going through Configuration > Content Authoring > SSIS News settings (or by visiting the following relative path /admin/config/ssis_news). There administrators can also specify a default path. 

## Uninstall

To uninstall this module please use the following drush command

```bash
drush pmu ssis_news
```