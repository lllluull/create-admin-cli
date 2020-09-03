process.on('unhandledRejection', err => {
    throw err;
  });


const fs = require('fs-extra')
const { defaultBrowsers } = require('react-dev-utils/browsersHelper');
const paths = require('../config/paths');
const ownPath = paths.ownPath;
const appPath = paths.appPath;
const path = require('path')

module.exports = function(
  appPath,
  appName,
  verbose,
  originalDirectory,
  templateName
) {
  const ownPackage = require(path.join(ownPath, 'package.json'));
  const appPackage = {
    eslintConfig: 'react-app',
    browserslist: defaultBrowsers,
    dependencies: ownPackage.dependencies
  }
  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );
  fs.copy(`${ownPath}/config`, `${appPath}/config`)
  .then(() => console.log('create config completed'))
  .catch((e) => console.log(error))
}