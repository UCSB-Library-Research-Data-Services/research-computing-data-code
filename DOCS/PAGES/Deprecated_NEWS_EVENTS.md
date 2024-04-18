# Add Resources to the News And Events Page

We are no longer using this page, but we keep it here for future reference if in need.

## Add Content
- Go to Manage >> Content >> Add Content >> NewsEvents
- Once the NewsEvent is added, you will be redirected to the Drupal Node.  This is not navigatable by a user on the website, so you can ignore the formatting.  To view it, visit the new News and Events Page.

## Edit/Delete NewsEvent:
- Go to Manage >> Content
- In the filter, you can search for the title of the NewsEvent you are looking for.  You should also use the 'Content Type' dropdown and change it to 'NewsEvent'.  

## Edit the News & Event View:
- Go to Manage >> Structure >> Views >> News & Event >> Edit
- Editing this may require a deeper understanding of Drupal.  I reviewed how I have structured this view (but for Resources) in /DOCS/DEVS/GETTING_STARTED.md in the section "Create Custom Display using views". There is also information on RESOURCES.md. 

## Change News & Event View into a Basic Page
Note that the the News & Event Page is not a content type of "Basic Page," but it is Drupal's View.  This means you can only add or remove content from it, but you cannot add text or anything else to the page.  In order to change the News & Event Page into a Basic Page instead of a view (ie so you can make edits to it like adding text above the News & Event list):
- Create a new content of Basic Page, and add the News & Event View to the page.  Then you can add other blades to the page while including the News & Event view.  
- Note that the News & Event view is currently taking path /news-events, so you may have to change this if you want a Basic Page instead.

## Edit NewsEvent Content Type / Node:
- Structure >> Content Types >> NewsEvent


## Localist
- https://docs.google.com/document/d/12bNZ6pQBBXNKFtDOPJK7VcDsMaDUCyu3KFHZiqvM0YY/edit#heading=h.ly7bjly2c922