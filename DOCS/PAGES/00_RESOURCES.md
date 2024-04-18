# Editing Resources Page
- For Resources pages, while clicking "Resources" in the menu, you can see it drops down with Overview, Computing Resources, Data Resources, Data Storage Finder, Data Tool Explorer, Regulated Research. You can find more details for Data Storage Finder & Data Tool Explorer in other documentations. This documentation will focus more on Overview, Computing Resources, Data Resources, and Regulated Research.

## Add a Resource
- Go to Manage >> Content >> Add Content >> Resource
- Once the Resource  is added, you will be redirected to the Drupal Node.  This is not navigatable by a user on the website, so you can ignore the formatting.  To view the new resource, you can go to the Resources page.
 

## Edit/Delete Resource:
- Go to Manage >> Content
- In the filter, you can search for the title of the Resource you are looking for.  You should also use the 'Content Type' dropdown and change it to 'Resource'.
- While creating/editing resource, pay attention to the "TypeOfResources" you pick. I already made the connection from different type of resources to each resource view. After choosing its type, it will show up in its page. Take "Sharing & Archiving" as an example, we pick "Data Resources" in "TypeOfResources" and then save. Now we can see it is shown up in /data-resources.

## Edit the Resource View:
- Unlike other page usually have one view, we actually have a lot views for resources pages: Resources, Computing Resources View, Data Resources View, Research Resources View, ResourceOverview1_VIew.
- Go to Manage >> Structure >> Views >> Resources >> Edit
- Editing this may require a deeper understanding of Drupal, and more is described below

#### Create Custom Display using views:
 go to Manage >> Structure >> Views >> Edit Resources.
- Take a note of how the Format is of 'Unformatted List' of 'Fields'.  What this means is that I specifically chose which fields to show when displaying a resource in this view.  
- Then, take a note at the "FIELDS," where most are 'hidden.'  I chose to hide these fields so that I have access to them, but that they will not be displayed by Drupal's default way of displaying them.  
- Go to the 'Image' field, and open its 'Style Settings.'  Here, you can see what classes I chose to add.  Some of these classes are created by UCSB's Web Sub theme that I chose to use in order to display the image a certain way.  But I also added my own class here, and then created the CSS for it in the ucsbwebrdhsub/css/styles.css for the website's subtheme.  Then take a look at the "Rewrite Results".  Here, I rewrote what is displayed in place of the Image.  All I did was add a wrapping HTML element over the field_image so that it can have a link.
- Go to the 'Resource Summary' field.  Then go to its 'Rewrite Results' settings.  This is another example of how to insert your own HTML to overwrite what is displayed for this field.  Take a note of how I used Drupal's "Replacement Patterns" to display other fields within this one.  
- It is very easy to replicate this view if you would like to create another page like the Resources Page.  Just create a new content type that is structured the same as the Resource content type.  Then, create a view for your new content type, and copy the structure of the Resources view for that view.  This was done with the News & Events page, which is just copying the view that the Resources page used.

## Edit Resource Content Type / Node:
- As you might notice, Resources section has Overview page, and each "kid" has their own page as well. In addition, each kid has its own view. I already set up everything in the View. In the future, if we need to have more grandkid for kid, we can add a resource normally. The only difference is that we need to pick a type for it, like "Computing Resources," "Data REsources," or "Research Resources." And then it will automatically shown in that view on that page
-  Structure >> Views >> research resources view, Computing Resources View, Data Resources, View ResourceOverview1_VIew.

## Menu for Resources
- While modifing, clicking Resources in the menu navbar, we can see everything from "Overview" to "Data Tool Explorer" is in the same column. Nonetheless, while logging out, as a normal user, we could see that "Overview" is in the first column, and the rest will be on the right side. It is a tiny bug from druapl, but it doesnt hurt that much.

## Edit Resources Page
- web/themes/ucsbwebrdhsub/templates/node--resource.html.twig
- web/themes/ucsbwebrdhsub/templates/node--resourceoverview1.html.twig
- web/themes/ucsbwebrdhsub/css/style.css
- web/themes/ucsbwebrdhsub/ucsbwebrdhsub.theme
