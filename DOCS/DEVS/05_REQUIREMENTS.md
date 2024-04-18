# Requirements for content editors for the Pantheon/Drupal Research Data Hub Website

## Content Editors:

### Need to be added as a 'team member' to the Pantheon site.
To add someone as a Team Member, you must also be a team member.  Go to the researchdata-ucsb-edu-v01 site dashboard on Pantheon.  On the top right, there is a "Team" button that you click to then add a team member by their email.  

### Need to be added to the Drupal site.
To add someone on the Drupal website, first login on the Drupal DEV site, then go to Manage >> People.  You can use "Add CAS user" to add a user with their UCSB Net ID so that they can login with their UCSB authorization.  Or you can use the other 'Add User' button to add someone with a custom username and password.  For full permissions for editing the website, give them "Administrator" role.

### Be added to the Github Repository
You will most likely not have to do a lot of work on the Github Repository, but it still may be useful to have the repo so that you can view the DOCS like this one.  Someone must add you to the repo at https://github.com/UCSB-Library-Research-Data-Services/researchdata-ucsb-edu-v01.  For more information on the Github workflow, go to DOCS/DEVS/GITWORKFLOW.md

## Devs:

### Make sure to have everything completed for 'Content Editors' listed above.

### Pantheon SSH Key:
For your computer to have access to make changes to the website, you must create a SSH Key for your computer with your Pantheon account to give your computer your Pantheon account's permissions.  Tutorial of how this is done: https://docs.pantheon.io/ssh-keys.


### Cyberduck and SFTP
Download and install Cyberduck: https://cyberduck.io/.  This is the best way to SFTP into the code for the website to make real=time edits and commits. In addition, if you have trouble using your password while connecting Pantheon to your local files, that might be because of your password. If you were using your UCSBNetId or Google account to log in to Pantheon, you might not have had your own Pantheon's password while registering because you were using your UCSBNetId SSO. If you also run into this situation, just go to personal setting => security => forgot my password, and then get a link to your email to set the new password. You can now use your password to connect to cyberduck now.

### Visual Studio Code and SFTP
Download and install Visual Studio Code. For extensions, also install SFTP. You might find these links helpful: https://docs.pantheon.io/guides/sftp/vscode-sftp. https://docs.pantheon.io/guides/sftp/sftp-development#commit-sftp-changes. Following the instructions from the links should be stright forward. Now make a little change to check if the connection works well before you move on to the coding or debugging. Once it works, every time you simply save the changed in vs code, you should be able to see the change in Pantheon's website. (Don't forget to clear the cache EVERY TIME, which is very necessary for the changes to show up in Drupal.) Once you are happy with it, end the SFTP mode and swtich to GIT on Pantheon website, and then move to Dev to merge the code. 

In addition of connecting to SFTP, while in the sftp.json file, simply copy the host, protocal, port, username. Then, you should have something similar:
    
    "privateKeyPath": "C:/Users/ychen/.ssh/id_rsa",
    "remotePath": "/code",
    "uploadOnSave": true,
    "useTempFile": false,
    "openSsh": false

You are now all set.


### Install your favorite text editor
I recommend VSCode. Cyberduck will allow you to open files live on the website into your chosen text editor. You will need this for mostly making CSS styles.

### Optional:
- Terminus is Pantheon's tool for facilitating commands that you can use for managing sites on Pantheon.  It is mostly helpful for installing modules and plugins for Drupal and Pantheon.  Docs: https://docs.pantheon.io/terminus.  An important note is that the only compatible operating systems are: MacOS; Windows 10 – WSL 2 Ubuntu 20.0; Ubuntu 20.0 – this would include Ubuntu under Docker or VirtualBox.  In addition, installing Terminus also requires installing PHP, Composer, and Git.
- For debugging, in addition to vscode, you can also debug the css with the help from chrome browser direcly. Hover to the part you wanna check, right click and go to inspect. For details, visit https://developer.chrome.com/docs/devtools/overview/. Happy coding and good luck!

