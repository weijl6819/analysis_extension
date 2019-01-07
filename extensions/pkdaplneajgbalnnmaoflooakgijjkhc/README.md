Lifesize.sky.webclient.plugins.all
==================================
To test:
npm run build:beta or npm run build:production
Download the repository unzipped into a folder.
Use chrome://extensions page and choose 'load unpacked extension'.
Point to the directory of the downloaded repository.

To prepare for QA/Deployment:
Ensure that the version in package.json has been updated.
npm run build:production
Zip the repository and go to http://artifacts.lifesize.com/artifactory/webapp/.
Choose 'deploy' and deploy to the lifesize.sky.chrome.plugin directory.
Append the version number to the end of the file name.

