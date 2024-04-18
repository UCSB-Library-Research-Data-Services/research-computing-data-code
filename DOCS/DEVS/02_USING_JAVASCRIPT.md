# How to add Javascript files to the website

## Only use Javascript if you have exhausted every other option.  Try to use twig templating, installing modules, or other traditional Drupal methods before trying to use Javascript.  I have not tested the cost that additional scripts have on the website's speed, so try to use Javascript sparingly unless you have discovered optimizations with Javascript.  

## Add a Javascript file to render for only a single page:
First, navigate to the code for the web subtheme.  (Open SFTP Connection with Cyberduck, navigate to the code >> web >> themes >> ucsbwebrdhusb)

### An example of how to do this is already here.
The files you need to look at for an example are: ucsbwebrdhsub.theme, js/data-literacy-series.js, ucsbwenrdhsub.libraries.yml.
#### How it works:
- First, look at what's in js/data-literacy-series.js.  My code is wrapped in two function definitions: The first one starts with "(function ($){..." .   You can think of this as a requirement of drupal for you to wrap all your code in this function in order for Drupal to use your script.  Then inside that function is another definition: 
"$(document).ready(function() {....})".  This is defined by Drupal for to have your script render after the document is rendered.  In this example, after the document is rendered, the script finds all anchor tags of a certain description, and sets their attributes so that the link on the anchor tag opens in a new page.
- Finally, take a look at ucsbwebrdhsub.theme.  There is a preprocessing function for the website that has a conditional that searches for our page with title "Data Literacy Series," and then it adds the library we created to the library that renders for that page.  
#### How to implement your own:
- First, create a new javascript file in the js folder, following the template of  js/data-literacy-series.js.
- Next, create your own library that has uses the new javascript file you created.  
- Finally, in  ucsbwebrdhsub.theme, you can copy and paste a conditional just like the one already in there inside the same function.  Just make sure to change the title to the Title that your drupal page has,  and change the library name appropriately. 

## Further examples of using javascript:  
You can take a look at the code in the ucsbwebsub subtheme folder for more complex examples of rendering javascript for Drupal.
