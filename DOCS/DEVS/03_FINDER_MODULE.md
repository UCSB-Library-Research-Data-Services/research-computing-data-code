# Editing the Data Tool Explorer Page or the Data Storage Finder page - Editing the Finder Module

- To edit the Data Storage Finder page, it is the exact same as the Data Tool Explorer page, but most of the names have '2' at the end.  For example - Data Tool Explorer corresponds to 'finder', but Finder2 corresponds to 'finder2'.

### Using git: Go to web/modules/CD-Finder-2-master to edit the Finder2 Page, or web/modules/CD-finder-master to edit the Data Tools Explorer Page
### With SFTP Connection (Recommended) - Go to code/web/modules/CD-Finder-2-master or code/web/modules/CD-finder-master

### Also Recommend Starting your own Multi-Dev:  https://docs.pantheon.io/guides/multidev

## Edit Page content / text / template:
- In the directory for the module (Data Tools Explorer or Finder2 page), go to /templates/finder(2).html.twig
- Here is the HTML for the page.  If you are new to HTML, I recommend opening the corresponding web page on your browser (ie visiting the page Data Tools Explorer Page if that's the one you are editing), and see what text in the HTML corresponds to on the page, and change and edit the text.  
- To change the title, go to /finder{2}.routing.yml.  under finder(2).content: there is a variable called _title.  Change that variable value to your desired title.

## Edit the Page CSS:
- Most of the CSS is in /css/finder.css

## Change Page Routing (ie Change the path of /finder2 to be /stat-tool-explorer)
- Open the /finder{2}.routing.yml file.  
- Change the value of 'path:' to the path that you want.  
- You can also change the path of where the settings form appears: under 'finder{2}.settings' in the same file, there is another path variable that you can change that corresponds to the settings.

## More on what Finder and Finder2 are:
- They correspond to the Finder Module from Cornell University: https://finder.research.cornell.edu/.
- They did not intend for the Finder module to be used multiple times in a single website, so when installing their module, only 1 Finder page can be created.  It also creates content type: Service, Paragraph Type: Service Paragraphs, Taxonomy: Facets, and a Control Type vocabulary.  Their documentation is here: https://github.com/CU-CommunityApps/CD-finder
- To make Finder2, we had to edit the finder module to create a non-conflicting installation of a separate instance of the finder module.  To do that, we changed most of the names for nodes to have '2' at the end of it.  
