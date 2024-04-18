# Editing the Data Tool Explorer Page.

### Visit: https://github.com/UCSB-Library-Research-Data-Services/researchdata-ucsb-edu-v01/blob/master/web/modules/CD-finder-master/docs/Finder_module.pdf for pdf documentation.

## Add a new Software/Service:
- Go to Manage >> Content >> Add Content >> Service
- The "Title" is for the name of the software.  The "Summary" is what is displayed on the purple card / selector table.  Keep it short.  You can add more details to this
service later, because this is NOT what is displayed in the Comparison Chart (that renders below the selector table).  
- Pick all the relevant facet matches.  If you need to make a new one, there is more information on how to do this below later in this tutorial.  The facet matches also do not determine any information that is displayed with the service, but this information is necessary for the filter to work (On the page, this information is for answering all the questions under "Describe your Data").
- Service Paragraphs: This is for all the information displayed WITH the service (in the Comparison Chart).  Note that if you do not have information for some of the fields, it is okay to leave it empty.  
- Once you add a new service, you will be redircted to a broken page.  This is expected, and it is caused by Cornell's developers because they did not create a viewable Drupal Node for the Service.  This is fine, because we typically don't make drupal nodes viewable to users anyways.  To view the new service, navigate back to the website and go to the Data Tool Explorer.

## Edit a new Software/Service
- Go to Manage >> Content
- In the filter, you can search for the title of the Service/Software you are looking for.  You should also use the 'Content Type' dropdown and change it to 'Service'. 
- Click on the Edit button next to the content.  If you click on the Content itself, it will take you to a broken page.  

## Add a new Facet
- Go to Manage >> Structure >> Taxonomy >> Facets
- Here, you will be able to add new answers and 'questions' for the "Describe your Data" form.  Note that the 'questions' are not semantically structured as actual questions, but rather they are labels for the data for the form. Example: 'Application', 'Campus Provider', 'Availability,'... Also note that drupal does not very clearly distinguish the questions from the answers because they will both be labeled as 'facets'.  But you can create a hierarchy that will make drupal render some facets as questions and others as answers to those questions (more on this later).  
- The facets added here will be added to both the frontend (Data Tool Explorer Page) and the backend (Adding/Editing a Service as described above).  In other words, once you add a facet here, you will be able to select it for your service, and you will be able to see this on the Data Tool Explorer Page after.  

### There is an 'Add Term' button you can use if you want to add a facet.

### If you are just adding an answer to one of the existing questions on the form:
 - First find and remember the "Control Type" of the question: Do this by finding the name/label of the question, and click "Edit".  For example, the first question is currently "Application," and you can tell it's a question because it has a bunch of facets under it that are indented after it.  So if you were to add a facet under this question, first check the control type of "Application" by clicking "Edit" for it.    The control type is either "radio" or "checkbox"
 - The control type of the answer that you are adding must be the same as the control type for the question that you are adding the answer under.
 - Go back to the Facets page and click Add Term
 - Add the name and the control type and click "Save and go to list"
 - Search for the facet term you just added.  Click and hold the cross-shaped 'move' cursor that is on the term so that you can drag the term to another place.
 - Drag the facet to be indented under the question that your answer is supposed to be under.  Make sure that it is indented under the question in a way that is in line with the rest of the answers.  

 ### Adding a question:
 - Click Add Term
 - Choose control type: Radio or Checkbox.  Radio is for a question that can have only one answer.  Checkbox is for a question that can have multiple answers.
 - Using the cross-shaped 'move' cursor on the term that you added, you can click and drag the term to reorder where it is displayed.  Make sure that it is not indented under another facet because this will make it into an answer.  

## Add Categories to the Comparison Chart
When you click "Compare Results," a comparison chart should render below the service table.  The comparison chart has additional information to compare one service to another based off of categories.  You can add or remove these categories if necessary:
### Manage >> Structure >> Paragraph Types >> Service Paragraphs
Here you can add categories by clicking "Add Field", or you can edit or delete the other categories.  When adding a category, select the field type "Text (formatted, long)," and type in the label which will be the name of the category that shows up on the Comparison Chart.  After you create your categories, if you want to reorder how the categories are displayed on the comparison chart, click on the "Manage Display" tab.  You will then see a icon that when you hover over it says "Drag to reorder."  You can also change the order of how these categories display in the backend (ie for when you enter in the information of what should be contained in the category for a specific service). You do this in the "Manage Form Display Tab".  Note: always make sure to save your work when you are finished.

 ## Editing other content on the Data Tool Explorer Page:
 - Unlike the other pages, editing the content of this page requires going into the code.  A pre-requisite is to have either a git connection estbalished, or by using cyber duck, so that you can commit the code changes to the website.  Since this requires going into the code, check under the DEVS docs for more information on how to edit the content.  


### There are further settings at route (on the drupal site) /admin/config/content/finder with little documentation on what it's for. It includes fields for email address, body, header, etc. As of right now, these settings have not been touched.