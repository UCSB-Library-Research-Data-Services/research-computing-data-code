# Action Panels module

This module adds new option to the Blade paragraph type and enables content editors in creating lists of action panels with images as background. The action panel containers can be configured with a overlay color and vertical or horizontal text orientation. These settings will be applied for all action items. Each action item has settings for title, subtitle and background image. 

## Dependencies

This module depends on the following modules:
  - lazy
  - media
  - media_library
  - twig_tweak
  - paragraphs

## Install

To install this module please use the following drush command

```bash
drush en ucsb_action_panels
```

## Usage

To use this option, when editing a Blade select the Action Panel Container option from the Column type drop down menu. 

## Uninstall

To uninstall this module please use the following drush command

```bash
drush pmu ucsb_action_panels
```