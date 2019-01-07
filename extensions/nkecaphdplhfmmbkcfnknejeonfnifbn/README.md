#FB Intel Tool V1.0.44 (latest)

##Repo Notes

There are 2 main branches:
* Master - for released code
* Staging - for testing prior to release

Only authorised developers should be able to commit to Master and staging

## Build Notes

As of 1.0.43 there is no need to change multiple files for setting api urls and versions.

* The version is set in **one place only** - manifest.json 
* The urls are in settings.js

Note settings.js is excluded from the repo. Simply copy one of
the settings files to settings.js after you check out.

* settings.live.js - points to live urls
* settings.staging.js - points to dev urls
* settings.test.js - points to test urls.

**There are no code files to edit.**


###Commits in Master
Only authorized people should check in to master.
**These commits must be tagged** if the commit gets uploaded to the chrome store
e.g. chr-str-1-0-22


###Commits to Staging
For bugs or feature work, create a new branch from staging and work in that, committing
as you see fit.

Staging is used for testing before production. 

**Do not push or merge changes directly to staging**
**Issue pull requests from your development branch**

## Server Side Code
The server side code can be built from the Master branch. Instructions to follow.
Simply include autoscroll.js in the manifest




