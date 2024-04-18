# Add Member to the Our Members Page

## How to connect JavaScript File to Drupal
- You might notice that in this page /rdc/our-members, when you click the tag of the member, it automatically goes to the page that is full of members with that tag.
- Unfortunately, we cannot do it directly in Drupal. While adding the url in each taxonomy, it will automatically add some symbols and mess up with the url. Thus, we need to write a JavaScript file to do the modify. In this case, it is called our-members.js under the js folder under ucsbwebrdhsub.
- After finishing the JS file, we also need to add something in ucsbwebrdhsub.libraries.yml:
  ```ruby
  our-members:
    version: 9
    js:
      js/our-members.js: {}
  ```
- Similarly for ucsbwebrdhsub.theme:
  ```ruby
  // Check if the current path starts with "/our-members/".
  $current_path = \Drupal::service('path.current')->getPath();
  if (strpos($current_path, '/our-members/') === 0) {
    $variables['#attached']['library'][] = 'ucsbwebrdhsub/our-members';
  }
  ```
- Now you can clear the cache and see the result on the website


## Add Content
- Go to Manage >> Content >> Add Content >> RDC Members