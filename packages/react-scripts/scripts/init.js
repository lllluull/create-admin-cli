process.on('unhandledRejection', err => {
    throw err;
  });


const fs = require('fs-extra')
const { defaultBrowsers } = require('react-dev-utils/browsersHelper');
const paths = require('../config/paths');
const path = require('path')
const chalk = require('react-dev-utils/chalk');
const execSync = require('child_process').execSync;

function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function isInMercurialRepository() {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function tryGitInit() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }

    execSync('git init', { stdio: 'ignore' });
    return true;
  } catch (e) {
    console.warn('Git repo not initialized', e);
    return false;
  }
}

module.exports = function(
  appPath,
  appName,
  verbose,
  originalDirectory,
  templateName
) {
  const ownPath = paths.ownPath;
  // const appPath = paths.appPath;
  const ownPackage = require(path.join(ownPath, 'package.json'));
  const appPackage = require(path.join(appPath, 'package.json'))
  appPackage.browserslist = defaultBrowsers
  appPackage.dependencies = {...appPackage.dependencies, ...ownPackage.dependencies}
  appPackage.babel = {...ownPackage.babel}
  appPackage.scripts = {
    start: 'react-scripts start',
    build: 'react-scripts build',
  }
  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );
  if (tryGitInit()) {
    console.log()
    console.log('Initialized a git repository.')
  }
  fs.copy(`${ownPath}/config`, `${appPath}/config`)
  fs.copy(`${ownPath}/template/src`, `${appPath}/src`)
  fs.copy(`${ownPath}/template/public`, `${appPath}/public`)
  fs.copy(`${ownPath}/scripts`, `${appPath}/scripts`).then(() => {
    fs.removeSync(`${appPath}/scripts/init.js`)
  })
  fs.copy(`${ownPath}/template/gitignore`, `${appPath}/.gitignore`)
  fs.copy(`${ownPath}/eslintrc.js`, `${appPath}/.eslintrc.js`)
  fs.copy(`${ownPath}/prettierrc`, `${appPath}/.prettierrc`)
  fs.copy(`${ownPath}/tsconfig.json`, `${appPath}/tsconfig.json`)
  fs.copy(`${ownPath}/.vscode`, `${appPath}/.vscode`)
  .then(() => {
    console.log('create config completed')
    console.log()
    console.log(chalk.green(`please cd ${appName} to get start ^_^`))
  })
  .catch((e) => console.log(error))
  
}