'use strict'

const shell = require('shelljs');
const chalk = require('chalk');
const fs = require('fs');

shell.echo(`Start building...`);

shell.echo(`Modifying final package.json`);
let packageJSON = JSON.parse(fs.readFileSync(`./package.json`));
packageJSON.private = false;
delete packageJSON.scripts.prepare;
fs.writeFileSync(`./package.json`, JSON.stringify(packageJSON, null, 2));

shell.echo(chalk.green(`End building`));
