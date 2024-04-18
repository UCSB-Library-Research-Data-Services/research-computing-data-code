# UCSB Research Data Community (RDC) 

- This is the page for RDC, we can access it with /rdc, or from Communities page => RDC. In the future, we might need to find another place to show it more apparently.

## Activate Left Side-bar Menu ( We actually removed this featue earlier, but still keep it for future reference.
- Go to the Custom block library, /admin/structure/block/block-content
- Edit the custom block of Sidebar Navigation type installed by default
- Block description: Sidebar Nav Menu Block
    Sidebar Navigation Menu: Main navigation
    Title: Sidebar Nav Menu
    Display title: check box
    Menu Levels (Initial visibility level: 2, Number of levels to display: Unlimited, Expand all menu items: unchecked).
    Advanced Options (Fixed parent item: Main navigation, Use as title: Active trail's root title, Children of active menu item: checked)
    HTML and Style Options (Theme hook suggestion): sidebar_nav
- Click Save
- Go to Block layout, /admin/structure/block
- Edit the custom "Sidebar Nav Menu Block" block under the Primary region (/admin/structure/block/manage/sidebarnavmenublock)
- Click Page tab and hide for the listed pages: <front>, /accessibility, /user; or display for a selected number of pages.
- Each site might use different settings based on their functional requirements.
- Click Block Cache and select the option to disable cache
- Save the block
- Clear cache to view the new block

For each child page of RDC, click "edit" to edit the page like other basic pages.