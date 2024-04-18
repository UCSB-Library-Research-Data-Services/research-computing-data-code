# Editing the Communities Page.

## Add a new Community:
- Go to Manage >> Content >> Add Content >> Community
- Title is important for the Community name (ie so you can search for it in case you need to edit it later), but it will not be displayed on the community page.
- Displayed Title/Logo is what will be displayed on the page as the Community's title.  Click on 'source' to enter or edit the HTML of it.  You can also change the text size by clicking the button that either says 'Normal' or 'Format'.  
- Body is the text displayed as the Community's body.  You can also click on 'source' here and also change the text size.
- Community-Label: Add 1 or more groups of which the community is open to.  (ie: undergrad, faculty etc.) Click "Add another item" to add multiple.
- Destionation URL is for the URL of the community.  
- - Community-Mode: Add if community is hybrid, remote, or in person.  
- Once the community is added, you will be redirected to the Drupal Node.  This is not navigatable by a user on the website, so you can ignore the formatting.  To view the new community, you can go to the Communities page.

## Edit/Delete Community:
- Go to Manage >> Content
- In the filter, you can search for the title of the Community you are looking for.  You should also use the 'Content Type' dropdown and change it to 'Community'.  

## Edit Community Page:  
- Go to Manage >> Content
- In the Filter 'Content Type' dropdown, change it to 'Basic page'.  Then the title is 'Communities'  
- Alternatively, on the Communities page there is an Edit Button
- The top image is under "Hero"
- The other content is under Main Content, including the Communities View.


## Edit Community Content Type / Node:
- Structure >> Content Types >> Community

## Edit the Communities View:
- The view is the list of communities.
- Structure >> Views >> Communities
- The view is mostly structured by custom templating and css.  The template file is under code/web/themes/ucsbwebrdhsub/templates/node--community.html.twig and the css is under  code/web/themes/ucsbwebrdhsub/css.  If you are editing the template, then I recommend reading the documentation in DEVS.  More information on Twig templating is below:

#### Twig Templating: 
An important skill will be to know how to use Twig templating.  It is basically just HTML and PHP that you can use to overwrite the default templating that Drupal provides.  Quickly review https://www.drupal.org/docs/theming-drupal/twig-in-drupal/working-with-twig-templates to see how it works, but it will be most helpful to practice when you get to that stage.  https://sarahcodes.medium.com/getting-drupal-8-field-values-in-twig-22b80cb609bd is a great resource for knowing how to access the Drupal values (mostly the field values are important) within Twig. 
- Take a look at code/web/themes/ucsbwebrdhsub/templates/node--community.html.twig which is used for the Community display.  It is a good example of how PHP and HTML is used in Twig to create a custom display for a content type. I recommend playing around with it by opening the file with cyberduck, and making sure you know how everything works in that file.  When you save the file using Cyberduck, you will notice real time changes made to your multidev site on the Communities page after you clear caches.  The best way to clear cache is to use Devel >> Cache Clear on the Drupal toolbar.  If you make a change that crashes the Communities page, that's okay! Just undo the change using Cyberduck, then open a new window of the Research Data Hub website that is NOT on the communities page, and clear cache again.  
