# Add Resources to the Resource Page

## Add a Resource
- Go to Manage >> Content >> Add Content >> Resource
- Once the Resource  is added, you will be redirected to the Drupal Node.  This is not navigatable by a user on the website, so you can ignore the formatting.  To view the new resource, you can go to the Resources page.
 

## Edit/Delete Resource:
- Go to Manage >> Content
- In the filter, you can search for the title of the Resource you are looking for.  You should also use the 'Content Type' dropdown and change it to 'Resource'.  

## Edit the Resource View:
- Go to Manage >> Structure >> Views >> Resources >> Edit
- Editing this may require a deeper understanding of Drupal, and more is described below:  

#### Create Custom Display using views:
 go to Manage >> Structure >> Views >> Edit Resources.
- Take a note of how the Format is of 'Unformatted List' of 'Fields'.  What this means is that I specifically chose which fields to show when displaying a resource in this view.  
- Then, take a note at the "FIELDS," where most are 'hidden.'  I chose to hide these fields so that I have access to them, but that they will not be displayed by Drupal's default way of displaying them.  
- Go to the 'Image' field, and open its 'Style Settings.'  Here, you can see what classes I chose to add.  Some of these classes are created by UCSB's Web Sub theme that I chose to use in order to display the image a certain way.  But I also added my own class here, and then created the CSS for it in the ucsbwebrdhsub/css/styles.css for the website's subtheme.  Then take a look at the "Rewrite Results".  Here, I rewrote what is displayed in place of the Image.  All I did was add a wrapping HTML element over the field_image so that it can have a link.
- Go to the 'Resource Summary' field.  Then go to its 'Rewrite Results' settings.  This is another example of how to insert your own HTML to overwrite what is displayed for this field.  Take a note of how I used Drupal's "Replacement Patterns" to display other fields within this one.  
- It is very easy to replicate this view if you would like to create another page like the Resources Page.  Just create a new content type that is structured the same as the Resource content type.  Then, create a view for your new content type, and copy the structure of the Resources view for that view.  This was done with the News & Events page, which is just copying the view that the Resources page used.


## Change Resource View into a Basic Page
Note that the the Resource Page is not a content type of "Basic Page," but it is Drupal's View.  This means you can only add or remove resources from it, but you cannot add text or anything else to the page.  In order to change the Resource Page into a Basic Page instead of a view (ie so you can make edits to it like adding text above the resource list):
- Create a new content of Basic Page, and add the Resource View to the page.  Then you can add other blades to the page while including the resource view.  
- Note that the Resource view is currently taking path /resources, so you may have to change this if you want a Basic Page instead.

## Edit Resource Content Type / Node:
Structure >> Content Types >> Resource
