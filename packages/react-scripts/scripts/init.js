process.on('unhandledRejection', err => {
    throw err;
  });


const fs = require('fs-extra')
const { defaultBrowsers } = require('react-dev-utils/browsersHelper');
const paths = require('../config/paths');
const path = require('path')

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
  fs.copy(`${ownPath}/config`, `${appPath}/config`)
  fs.copy(`${ownPath}/template/src`, `${appPath}/src`)
  fs.copy(`${ownPath}/template/public`, `${appPath}/public`)
  fs.copy(`${ownPath}/scripts`, `${appPath}/scripts`)
  fs.copy(`${ownPath}/template/gitignore`, `${appPath}/.gitignore`)
  fs.copy(`${ownPath}/template/babelrc`, `${appPath}/.babelrc`)
  fs.copy(`${ownPath}/eslintrc.js`, `${appPath}/.eslintrc.js`)
  fs.copy(`${ownPath}/prettierrc`, `${appPath}/.prettierrc`)
  fs.copy(`${ownPath}/tsconfig.json`, `${appPath}/tsconfig.json`)
  fs.copy(`${ownPath}/.vscode`, `${appPath}/.vscode`)
  .then(() => console.log('create config completed'))
  .catch((e) => console.log(error))

}