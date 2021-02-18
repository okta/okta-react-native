'use strict';

const shell = require('shelljs');
const chalk = require('chalk');
const fs = require('fs');

const NPM_DIR = `dist`;
const FILES_TO_COPY = [
  'index.js',
  'types/index.d.ts',
  'android',
  'ios',
  'LICENSE',
  '*.md',
  'package.json',
  'OktaSdkBridgeReactNative.podspec'
];

shell.echo(`Start building...`);

shell.mkdir(`${NPM_DIR}`);
shell.rm(`-Rf`, `${NPM_DIR}/*`);
shell.cp(`-Rf`, FILES_TO_COPY, `${NPM_DIR}`);

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

fs.writeFileSync(`./${NPM_DIR}/package.json`, JSON.stringify(packageJSON, null, 4));

shell.echo(chalk.green(`End building`));
