# Editing the Calendar Page.

## We are no longer using this page, but we keep it here for future reference if in need.

## Change the Calendar Tags:
- The calendar dashboard is at https://campuscalendar.ucsb.edu/rds_405/home.  
- Build a new embed widget
- Select your desired option.  The most important option is Tags and Keywords.  
### Step 1: Display options (THESE SETTINGS ARE REQUIRED):
- Widget Type: Select Mini Calendar + List
- Style: Select Card
- Select Hide View All Events Link
- Select Hide Filter Dropdown
- Select Open Links in new window
### Step 2: Get the HTML:
- Click Generate Embed Code and copy the HTML code.
- Go to the Calendar Page at [ https://nj-exp5-researchdata-ucsb-edu-v01.pantheonsite.io/calendar](https://dev-researchdata-ucsb-edu-v01.pantheonsite.io/calendar) and click edit to edit the page
- Click on the Main Content Dropdown
- Click on the dropdown for the Second Blade.
- Click Edit for that blade
- Click Edit For the Column
- In the "Body" click "Source" which shows the HTML for the past calendar.
- Remove that code and copy and paste the new HTML.  Then save the page.
- If done correctly, the new calendar should look the same as the old one, but it contains different events depending on which ones you selected with tags.

### Step 3: Change the tags in the code:
- On github, go to web/themes/ucsbwebrdhsub/js
- Open the calendar.js file on Github
- there is a tags list near the top of the file. Simply add / modify that list with however you want, keeping the formatting.  
- Save your changes.  These changes will automatically be pushed to the Dev site.  If there is an error with this automation, please see GITWORKFLOW.md
- To have your changes made on a multi-dev, change the multidev mode to Git, and merge the Dev code into the Multi-dev. 
- An alternate way to do this step is to go into the code using cyberduck or with git and pushing the changes to your specific site. 

## Edit the other content of the Calendar Page:
- Go to the Calendar Page at [https://nj-exp5-researchdata-ucsb-edu-v01.pantheonsite.io/calendar](https://dev-researchdata-ucsb-edu-v01.pantheonsite.io/calendar) and click edit to edit the page
- Click on the Main Content Dropdown
- Click on the dropdown for the First Blade.
- Click edit on the blade and edit on the column if you want to edit that column.

## Understanding the code:
On web/themes/ucsbwebrdhsub/js/calendar.js
- When creating the embed code for the calendar, it has HTML that has a script element that has an outside link.  The script is updated online where
they also have all the data for all the events for the calendar.  This means it is not possible to just download the script and put it onto the website, because the script has data on it that requires updates online.  
- A work around for this is to create a script that is going to overwrite some things on the original script so that we can have customizations.  This is what calendar.js does.  
- It first has to edit the HTML created from the original javascript file so that the "onclick" functions are changed to use the functions that we have in calendar.js.  It also changes some other things in the HTML, like the names of the calendar buttons.
- Then, the minicalendar object is mostly copy and paste from the original javascript file they use.  The main differences is that we have to grab the minicalendar id as well as the start month from the original javascript file in order for ours to work and overwrite the original one. 
- Then, the choose Today button is changed to be a choose Month button, and the choose week button is changed to be choose Past events button.  And finally, if a single day is selected, the code will change it so at least a week is always selected so that selecting a day will show the events for that whole week.
