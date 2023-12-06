INTRODUCTION
------------

 The Sidebar Navigation module creates a new block type that allows to setup a menu block
 on either sidebar (Primary or Secondary). This module is useful for those sites with lot of menu items.


REQUIREMENTS
------------

This module requires the following modules:

 * Block (https://www.drupal.org/docs/core-modules-and-themes/core-modules/block-module)
 * Block field (https://www.drupal.org/project/block_fields)


INSTALLATION
------------

 * Install the Sidebar Navigation module as you would normally install a
   Drupal module. Enabling module enables the Block Field module
   before installing the Sidebar Navigation module.


CONFIGURATION
-------------

The ssis_sidebar_nav module creates a custom block type called "Sidebar Navigation".

Steps to activate:
1- Activate module.
2- Go to the Custom block library, /admin/structure/block/block-content
3- Edit the custom block of Sidebar Navigation type installed by default
 * Block description: Sidebar Nav Menu Block
 * Sidebar Navigation Menu: Main navigation
 * Title: Sidebar Nav Menu
 * Display title: check box
 * Menu Levels (Initial visibility level: 2, Number of levels to display: Unlimited, Expand all menu items: unchecked).
 * Advanced Options (Fixed parent item: Main navigation, Use as title: Active trail's root title, Children of active menu item: checked)
 * HTML and Style Options (Theme hook suggestion): sidebar_nav
4- Click Save
5- Go to Block layout, /admin/structure/block
6- Edit the custom "Sidebar Nav Menu Block" block under the Primary region (/admin/structure/block/manage/sidebarnavmenublock)
7- Click Page tab and hide for the listed pages: <front>, /accessibility; or display for a selected number of pages.
Each site might use different settings based on their functional requirements.
8- Save the block
9- Clear cache to view the new block

UNINSTALL
------------

 * Uninstall the Sidebar Navigation module as you would normally uninstall a
   Drupal module at /admin/modules/uninstall.

 Important: Remove the Sidebar Nav Menu Block from the Primary region before uninstalling.
