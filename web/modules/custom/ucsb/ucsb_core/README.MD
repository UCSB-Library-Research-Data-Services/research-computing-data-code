# UCSB Core module

This module provides core functionality for UCSB Drupal sites, including wordmark accessibility improvements and content editing enhancements.

## Features

### Wordmark Accessibility (Update 10001)
Processes SVG wordmark logos to add accessibility attributes for screen readers:
- Adds `role="img"` attribute
- Adds `aria-labelledby="departmentname"` attribute
- Creates or updates `<title id="departmentname">` elements with site name

### Hide Title Field (Update 10002)
Adds a "Hide Title" boolean field to Basic pages that allows content editors to hide page titles on individual pages.

### Pantheon Performance (Update 10003)
Optimizes Drupal performance for Pantheon hosting:
- Disables Big Pipe module to prevent caching conflicts
- Enables Pantheon Advanced Page Cache module for optimal caching performance

## Dependencies

This module depends on the following modules:
  - site_settings

## Install

To install this module please use the following drush command

```bash
drush en ucsb_core
```

After installation, run database updates to apply the functionality:

```bash
drush updatedb
```

## Usage

### Wordmark Processing
The module automatically processes wordmark SVGs configured in site settings when update 10001 runs. Check the logs for processing results.

### Hide Title Field
After update 10002 runs, a "Hide Title" checkbox will appear on Basic page edit forms (below the title background color field). Content editors can check this box to hide the page title on individual pages.

## Uninstall

To uninstall this module please use the following drush command

```bash
drush pmu ucsb_core
