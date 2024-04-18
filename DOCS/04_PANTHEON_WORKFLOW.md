# Pantheon Workflow 

## Idea of Code vs Database / Files
- There is a strict distinction between the Code and the Database / Files on Pantheon
- Database / Files refers to any content changes you would make using Drupal (besides for installing modules and updates which requires installing to the code base).  For example, if you add a new Basic Page to the site, this would NOT be in the code, but it would be in the Database/Files
- Code is separate.  The code is what renders all the database / files so that they are presented a certain way. 
- Database / File changes are live.  If you use Drupal to add content, you do not have to push those changes to the site.  You would, however, need to replicate the database/files onto other sites if you want your changes to be seen on another site.  For example, if you added content to a multidev, then you would need the dev site to clone over the content, or else it will not have your changes.  (More on this below).
- Code changes are not live, and, you have to push to the website to see any changes.  If you are using git, this is done by either pushing your local changes to the github master branch (view DEVS/GITWORKFLOW) or by pushing to any branch using the Pantheon remote git connection.  If you push the code directly to Pantheon, github will not have the code, so you should push to github as well. 
- Code changes with SFTP mode on Pantheon: On Pantheon, if you made code changes with SFTP, then you can push the code using Pantheon's interface.
- Similar to Database / Files, once you push the code to the site, the code changes are ONLY for that site, and so you would have to merge the code over to see it on another site.  For example, if you made code changes to a multidev, but now want your code changes to go to the dev site, you must merge the multidev code into the dev site.  More on this below.

## Editing Content with Drupal:
- When you use drupal to add content / edit pages etc., the database/files are automatically updated on the site that you are making edits on.  This means that you do NOT have to make any code pushes etc.  The changes you make are live for the site that you are editing.
- Changes you make on drupal are only seen for YOUR site.  For example, if you add content to the Dev site, that content is not yet on the Test, multidevs or Live sites.  Furthermore, if you add content to a MultiDev site, that content will not be seen on any other multi-dev nor the dev site etc.
- To push your content changes from one site to another, you can only do this by copying the entire site's database/files to overwrite the other site's database/files.  So if you added content to the wrong site, and you do not want that site's content to completely overwite the site you want to push your changes to, then you must redo all the changes you've made on the other site.
- To push content changes to a site, on Pantheon, go to the desired site that you want the changes pushed to.  Then go to Database / Files, choose the site you want to copy the content from.  Then click "Clone database / files".  This does NOT transfer over code changes.  

## Transfer code changes on Pantheon:
- Make sure the two sites you want to transfer from are on GIT mode.  
- Go to the site tab of the site you want to make changes to, and to go "Merge."  If there are code changes made in another site, then it should be displayed here. 

## Drupal modules installation / extension

If you are installing a new module on drupal, then make sure that the website is in SFTP mode on Pantheon

## Multi-dev
- I recommend having a multi-dev when making any changes to the website.  This is so that if your changes crash or ruin the website, you can just create a new multi-dev and delete the old one.
- Merging the code from multi-dev to dev should be self-explanatory.  But note that the Database/Files are not transferred over when you merge the multi-dev into dev.  For example, if you created a new content type in the multi-dev, then it will not show up in the dev.  To transfer these files, go to the Dev Data / Files >> Clone tab and clone from your multi-dev environment.  

## Backups / Crashes
- If your dev or multi-dev site ever crashes, just go to the backups tab and restore one of the backups.
- You should be making sure that scheduled Backups are always running on dev for this reason, and you can create a manual backup if necessary.
- Create backups in git mode.

## Status Errors and Updates
- From time to time there may be errors that show up in "System Status."  Common ones include: Public files directory / Error / Not fully protected and Webform: External libraries / Error / 19 libraries (2 installed; 1 excluded; 16 CDN)
- These ones are usually harmless, and they are fixed once upstream updates appear for the version of Drupal 9 / UCSB Web Theme (in the Code Tab of Panbtheon).  Once these updates are ready, and after you install them, they will update the drupal core for you and usually fix the System Status errors.  
- For this reason, you should not have to worry about updating the Drupal Core manually, even if you get an error telling you to do so.  I have had problems before where the drupal would not install the updates correctly.  Usually it is just better to wait for the upstream updates to appear for new version of  Drupal 9 / UCSB Web Theme, and installing those updates will update the Drupal Core for you. 

## Visual Studio Code
- In terminal of vs code, clone the git to your local environment (if it's from github: ; if it's from patheon:)
- Do the change you need in vs code
- cd "file_name" (open the file)
- git checkout -b "branch_name" (go to the branch to do the modify work. need to make sure that it work well in branch, and then merge it to the master one later to be safe)
- save the files (ctrl S)
- git add . (save it)
- git commit -m "the_message_u_wanna_commit"
- git push origin "branch_name"
- now go to pantheon website, click dev, click merge, and then merge

- (not done yet btw)