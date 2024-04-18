# Getting Started

## In this document, you will review all the requirements and training for developing the Research Data Hub Website.

## Firstly, you will have to review UCSB's Brand Guidelines to know what restrictions are in place for how to design a UCSB website. 

https://brand.ucsb.edu/our-story

https://ucsb.app.box.com/v/visual-identity-guidelines

https://webtheme.brand.ucsb.edu/docs/content-editors/menus-utility-bar-footer

https://webtheme.brand.ucsb.edu/support

https://webtheme.brand.ucsb.edu/pre-launch-checklist

## As a dev for the Research Data Hub website, you will need to learn the basics of Drupal.  

### Pantheon has a crash-course for Drupal 9 which I recommend going through: https://pantheon.io/drupal-9-training.  Note you have to scroll down to see the webinar recordings, and you do NOT have to sign up for the webinar.  

### I also recommend getting more Drupal practice from Acquia which has free, in-depth Drupal courses: acquiaacademy.com/  Create an account, then start the "Drupal 9 Site Building Course" which is part of the "Drupal Developer Certification Learning Plan."  This should be a free course (as of May 2023). You will only need to complete the "Drupal 9 Site Building Course," and none of the other courses that are part of the learning plan, although Acquia is a good resource for any Drupal learning.  

- For Drupal 9 Site Building Course: You can skip Units 1-3 as they are not really relevant.  
- I recommend creating your own Drupal website on Pantheon in order to follow along the course.
- Pay extra attention and take notes on how to create and edit Content Types, creating custom form displays, building custom and complex views, and creating a taxonomy.  

## Cyberduck
Much of the custom CSS editing and HTML templating will be done via SFTP connections with Cyberduck.  But before you make any edits, I recommend making your own Multidev environment.  Read more about what that means here: https://docs.pantheon.io/guides/multidev.  Basically, a multidev environment is Pantheon's version of having a git branch that you can use for development purposes before merging it into master (the 'DEV' site is the master branch).  After creating your multidev, open it up on pantheon, then change it to SFTP mode.  Once that's done, click Connect with SFTP >> Open SFTP Client.  Then, Open Cyberduck.
### CSS Code
All the website's code is under the 'code' directory.  In code/web/themes/ucsbwebrdhsub is where you will make most of your edits.  This is the folder that contains the active sub-theme for the Research Data Hub Website.  It inherits the UCSB Web theme, then it adds CSS as well as templates to it.  You can go ahead and open the 'styles.css' file with your preferred text editor, and this is all the CSS that is specifically for the Research Data Hub Website, and it is where you will make all your CSS additions, too. 
### Creating Custom Content Formats:
- Drupal has lots of limitations for how content is formatted, so I found it much easier to skip around Drupal's content display editing and to just use my own HTML.
#### Twig Templating: 
An important skill will be to know how to use Twig templating.  It is basically just HTML and PHP that you can use to overwrite the default templating that Drupal provides.  Quickly review https://www.drupal.org/docs/theming-drupal/twig-in-drupal/working-with-twig-templates to see how it works, but it will be most helpful to practice when you get to that stage.  https://sarahcodes.medium.com/getting-drupal-8-field-values-in-twig-22b80cb609bd is a great resource for knowing how to access the Drupal values (mostly the field values are important) within Twig. 
- Take a look at code/web/themes/ucsbwebrdhsub/templates/node--community.html.twig which is used for the Community display.  It is a good example of how PHP and HTML is used in Twig to create a custom display for a content type. I recommend playing around with it by opening the file with cyberduck, and making sure you know how everything works in that file.  When you save the file using Cyberduck, you will notice real time changes made to your multidev site on the Communities page after you clear caches.  The best way to clear cache is to use Devel >> Cache Clear on the Drupal toolbar.  If you make a change that crashes the Communities page, that's okay! Just undo the change using Cyberduck, then open a new window of the Research Data Hub website that is NOT on the communities page, and clear cache again.  

#### Create Custom Display using views:
If you do not need a very customized content display, and you are using a view to display the content, then you may be able to skip the headache of Twig Templating by just using HTML inside Drupal.  
- A great example: Go onto your Drupal multidev site, and go to Manage >> Structure >> Views >> Edit Resources.
- Take a note of how the Format is of 'Unformatted List' of 'Fields'.  What this means is that I specifically chose which fields to show when displaying a resource in this view.  
- Then, take a note at the "FIELDS," where most are 'hidden.'  I chose to hide these fields so that I have access to them, but that they will not be displayed by Drupal's default way of displaying them.  
- Go to the 'Image' field, and open its 'Style Settings.'  Here, you can see what classes I chose to add.  Some of these classes are created by UCSB's Web Sub theme that I chose to use in order to display the image a certain way.  But I also added my own class here, and then created the CSS for it in the ucsbwebrdhsub/css/styles.css for the website's subtheme.  Then take a look at the "Rewrite Results".  Here, I rewrote what is displayed in place of the Image.  All I did was add a wrapping HTML element over the field_image so that it can have a link.
- Go to the 'Resource Summary' field.  Then go to its 'Rewrite Results' settings.  This is another example of how to insert your own HTML to overwrite what is displayed for this field.  Take a note of how I used Drupal's "Replacement Patterns" to display other fields within this one.  

### Clear Caches
When editing the code using SFTP mode, the changes will most likely not appear right away because the website is cached.  In order to clear caches, the fastest way to do this is with Devel.  It should be a tab in the Drupal toolbar "Devel" and "Cache Clear" is the first option after you click on Devel.  

### Upstream Update
Swtich to Git if you were in SFTP mode. And then update in Pantheon. Do not update directly in drupal, which will cause the website (that branch) be blank. As usual, update in the test branch to make sure it work well before updating directly in the dev.

### Content/code Update after live
Since the website is live now, after changing the content or code, we need to clone in the following sequence: multidev -> dev -> test -> live. Check in every step to make sure everything looks fine before we make the changes live!



### Other Resources
- https://selwynpolit.github.io/d9book/ is a very recent resource we came across that would be good for advanced Drupal development.
