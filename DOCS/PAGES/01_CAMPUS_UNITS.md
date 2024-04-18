# Editing the Campus Units Page.
#### (it used to be called Partner, so if u found this word instead of campus unit, dont be surprise. Sorry for any inconvenience : ))

## Add a new Campus Unit:
- Go to Manage >> Content >> Add Content >> Partner
- Title is important for the Campus Unitname (ie so you can search for it in case you need to edit it later), but it will not be displayed on the Campus Unitpage.
- Name: just be same as title
- Destionation: long description for the Campus Unit.  
- URL: the website link of this Campus Unit.
- Tags: tags for each campus unit.
  
## Edit/Delete Campus Unit:
- Go to Manage >> Content
- In the filter, you can search for the title of the Campus Unit (Partner)you are looking for.  You should also use the 'Content Type' dropdown and change it to 'Partner'.  

## Edit Campus Units Page:  
- Go to Manage >> Content
- In the Filter 'Content Type' dropdown, change it to 'Basic page'.  Then the title is 'Campus Units'  
- Alternatively, on the Campus Units page there is an Edit Button
- The other content is under Main Content, including the Campus Units View.


## Edit Campus UnitContent Type / Node:
- Structure >> Content Types >> Partner

## Edit the Campus Units View:
- The view is the list of Campus Units.
- Structure >> Views >> Partners
- The view is mostly structured by custom templating and css.
- The template file is under code/web/themes/ucsbwebrdhsub/templates/node--partner.html.twig and the css is under code/web/themes/ucsbwebrdhsub/css.
- web/themes/ucsbwebrdhsub/ucsbwebrdhsub.theme is also necessary here. If u didnt run into trouble no need to modify this file. Nonetheless, if u run into trouble in twig, go check this file and you will know why. 
- (btw, as started earlier, the file name is partner cuz the view name is partner cuz it was named partner in the past : ))


## Icon/Image in Drupal
- There are two ways using images in drupal, one is through media, the other one is theough a random blade. Personally recommend the blade one, cuz that would be easier.
- Open a random page, edit, open a random blade, click image, then you can see the public folder. Now upload the images you need. Put them in the time order. For example, today is Aug 16th, 2023, I put the images I need in this page in the folder 2023-08.
- and then copy the path, such as "/2023-08/expand.png"
- According to https://www.drupal.org/docs/contributed-modules/twig-tweak-2x/cheat-sheet#s-drupal-image, we can use something like

      {# Render image specified by file URI. This is relative to default sites directory. If your file has the path `sites/default/files/2020/05/ocean.jpg`, drop the default sites directory bit. #}
      {{ drupal_image('public://2020/05/ocean.jpg') }}
      {# Render image using 'thumbnail' image style and custom attributes. #}
      {{ drupal_image('public://2020/05/ocean.jpg', 'thumbnail', {alt: 'The alternative text'|t, title: 'The title text'|t}) }}
  
- In this case, we have

      <a href="{{ node.field_link.uri }}" class="link-icon" target="_blank" rel="noopener noreferrer">{{ drupal_image('public://2023-08/link.png', 'thumbnail', {alt: 'Link Icon'}) }}</a>
      <span class="expand-icon" data-toggle="collapse" data-target="#collapse{{ node.id }}">{{ drupal_image('public://2023-08/expand.png', 'thumbnail', {alt: 'Expand Icon'}) }}</span>

- You are now all set : ))