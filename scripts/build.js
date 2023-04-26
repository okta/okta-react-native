'use strict';

const shell = require('shelljs');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');

const NPM_DIR = `dist`;
const FILES_TO_COPY = [
  'index.js',
  'types/index.d.ts',
  'android',
  'ios/OktaSdkBridge',
  'ios/ReactNativeOktaSdkBridge.xcodeproj',
  'LICENSE',
  '*.md',
  'package.json',
  'OktaSdkBridgeReactNative.podspec'
];

shell.echo(`Start building...`);

shell.mkdir(`-p`, `${NPM_DIR}`);

// Check whether a build folder isn't empty. If so, then delete any contents there. 
const folderSize =  parseInt(shell.exec(`du -s ${NPM_DIR} | cut -f1`).stdout);
const folderContents =  shell.exec(`ls -A ${NPM_DIR}`).stdout;
if ((folderSize && folderSize > 0) || (folderContents && folderContents != '')) {
  shell.echo(`Removing contents of build folder...`);
  shell.rm(`-Rf`, `${NPM_DIR}/*`);
}

// Create the nested folders to mirror files structure.
FILES_TO_COPY.forEach(function(filePath) {
  const parentDir = path.join(NPM_DIR, path.dirname(filePath));
  if (parentDir != NPM_DIR) {
    shell.mkdir(`-p`, parentDir);
  }
  
  shell.cp(`-Rf`, filePath, parentDir);
});


shell.echo(`Modifying final package.json`);
let packageJSON = JSON.parse(fs.readFileSync(`./${NPM_DIR}/package.json`));
delete packageJSON.private; // remove private flag
delete packageJSON.scripts; // remove all scripts
delete packageJSON.jest; // remove jest section
delete packageJSON['jest-junit']; // remove jest-junit section
delete packageJSON.workspaces; // remove yarn workspace section

// Remove "dist/" from the entrypoint paths.
['main', 'module', 'types'].forEach(function(key) {
  if (packageJSON[key]) { 
    packageJSON[key] = packageJSON[key].replace(`${NPM_DIR}/`, '');
  }
});
packageJSON['dependencies']['@okta/okta-auth-js'] = "file:../auth-js-pr";

fs.writeFileSync(`./${NPM_DIR}/package.json`, JSON.stringify(packageJSON, null, 4));

shell.echo(chalk.green(`End building`));
