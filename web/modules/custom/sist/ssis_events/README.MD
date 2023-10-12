# SSIS Events module

This module adds new content type called Events and enables content editors to easily create and manage regular and recurring events. The events can be organized into categories (calendars) and can be rendered in multiple ways.

## Dependencies

This module depends on the following modules:
  - color_field
  - content_moderation
  - datetime
  - entity_browser
  - filter
  - lazy
  - link
  - media
  - media_library
  - menu_ui
  - node
  - options
  - path
  - pathauto
  - scheduler
  - simple_gmap
  - smart_date
  - smart_date_recur
  - system
  - taxonomy
  - text
  - toolbar
  - twig_tweak
  - user

## Install

To install this module please use the following drush command

```bash
drush en ssis_events
```

## Usage

To use this option, once you have created event you will need to configure views to render the events on pages. 

## Uninstall

To uninstall this module please use the following drush command

```bash
drush pmu ssis_events
```