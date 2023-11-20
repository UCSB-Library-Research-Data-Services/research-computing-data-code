# Glossary of Terms module

This module allows the creation of unlimited Glossary of Terms pages that can be displayed as individual pages or embedded as a view block within a Basic page.

## Dependencies

This module depends on the following modules:
- better_exposed_filters
- content_moderation
- ief_table_view_mode
- node
- path
- taxonomy
- twig_tweak
- user
- views
- paragraphs

## Installation

To install this module please use the following drush command:

```bash
drush en ucsb_glossary
```

## Usage

### Create a Glossary of Terms page

1) Add a Glossary of Terms entity `/node/add/ucsb_glossary`
2) Click button to `Add new Term`
3) Enter `Term` & `Definition`
4) Click `Create term` button
5) Click `Save` button to save the page

### Embed a Glossary of Terms

1) Create a Glossary of Terms entity `/node/add/ucsb_glossary`
2) Click button to `Add new Term`
3) Enter `Term` & `Definition`
4) Click `Create term` button
5) Click `Save` button to save the page
6) Copy `node id` for this `Glossary of Terms` page
7) Edit a `Basic` page or create a new Basic page (`/node/add/page`)
8) Insert a `View` Column type within a `Blade` or `Add View`
9) Select `Glossary of Terms` View
10) Choose your view, example: `Glossary of Terms (List Display)` block
11) Open `OPTIONS` fieldset
12) Enter `node id` for the Glossary of Terms in the `Argument` text box.
13) Click `Save` button to save the page

## Uninstall

To uninstall this module please use the following drush command

```bash
drush pmu ucsb_glossary
```