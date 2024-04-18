# Github and Pantheon Integration

## Automation

- There is a github action deploy-to-pantheon.yml that is triggered ONLY when you push code to the master branch on the github repo.  This action will automatically pull code from the dev master branch from Pantheon (to merge Pantheon repo with Github Repo) and then it will push your code changes to Pantheon dev environment as well, so your code changes will be seen on both the Github and the Pantheon repositories.  Again, this is only automated if you push your code to the Github repo master branch.  

- It is also important for the dev environment of the Pantheon site to be on the Git Development Mode in order for this automation to work.

- A possible error is if there are merge conflicts between the Pantheon and the Github repositories because of failure to synchronize those repos.  In order to resolve these conflicts, you must set a remote connection with the Pantheon repo (in addition to the Github one) and merge both the repos on your local computer to resolve the conflicts locally before pushing the code again to Github or Pantheon.  More Details are below.

## Setting up two remotes to the Github and Pantheon Repos

- It is still recommended to have two remote connections: with both the Pantheon and Github repositories.  The workflow should be that you could only use the github repository for code changes since it should automatically update the Pantheon repository when you push your code to the master branch on Github.  However, you will most likely need both remote connections in case of merge conflicts as it is likely that the Pantheon repository will have updates that make it different from the Github Repo, and changes to the Pantheon repo are not automatically pushed to the Github Repo.  

- Here is how to do that according to pantheon's docs: https://pantheon.io/docs/guides/git/collaborative-development.

### Step 1: Git clone from Pantheon.

On the pantheon dashboard for the researchdata-ucsb-edu-v01 site, there is a Clone with Git dropdown. You need to use that to clone the repo into your local computer.  

### Step 2: Add this Github Repository as a Remote

- You do this by: git remote add github [git clone URL]

- Important note: Now you should now have two remote repositories connected to your local repo.  The Pantheon one is called 'origin,' and the github one is called 'github'.

### Step 3: Pushing any code changes: 

When you push a code change, you can push to either the Github remote labeled 'github' or the Pantheon remote labeled 'origin', or both.  You would probably want to push your code to both if you are working on either a multidev or on a separate branch from the master branch.  But if you are just updating the code on the master branch directly, then you can make sure top set the Pantheon Development Mode to Git, and then pushing your code to the master branch on Github will automatically push the code to the Pantheon repo for you.  Having this set up is also good to make sure there are no merge conflicts.  To do this, you must git pull from both 'origin' and 'github' remote repositories.


### Branching Workflows:

Github and Pantheon both have their own ways of creating branches, then merging them into the main code.  Github uses Pull Requests to do this.  In Pantheon, it is with 'multidev.'

## Getting the Error: Run Failed: Deploy to Pantheon Workflow
You may get an error like this for a few reasons.  One of which is you are pushing to the github repository too quickly, so github is not able to push your changes to Pantheon before you make successive pushes to github. 
In general, if you encounter an error for this workflow on Github after trying to push your code changes to github, you can fix it with the following:
- Make sure the Dev site on Pantheon is on Git Development Mode.
- Set up the two remotes with Github and Pantheon as described how to above.
- Git pull from both remotes onto your local code.  ie: 'git pull origin master' and then do 'git pull github master'.  This should merge the most recent code from the two different remotes into your local repository.  
- Resolve any merge conflicts if git tells you there are any.
- After you made your changes, add the changes to a commit, and push to github with 'git push github master'.  
- There should not be an error on the next Deploy to Pantheon Workflow, so github should automatically push the code changes to Pantheon's repository.

## Summary:

Any git pushes to the master branch on the Github Repository will automatically push the changes to the Pantheon dev Repository. ie: git push github master

  
