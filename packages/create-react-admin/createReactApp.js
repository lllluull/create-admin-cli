const packageJson = require('./package.json');
const commander = require('commander')
const chalk = require('chalk')
const https = require('https');
const semver = require('semver')
const path = require('path')
const os = require('os');
const validateProjectName = require('validate-npm-package-name');
const fs = require('fs-extra')
const spawn = require('cross-spawn')
const execSync = require('child_process').execSync;

const dependenciess = ['react', 'react-dom', 'react-router-dom', 'xiaoma-react-scripts']

function checkForLatestVersion() {
    return new Promise((resolve, reject) => {
      https
        .get(
          'https://registry.npmjs.org/-/package/create-xiaoma-admin/dist-tags',
          res => {
            if (res.statusCode === 200) {
              let body = '';
              res.on('data', data => (body += data));
              res.on('end', () => {
                resolve(JSON.parse(body).latest);
              });
            } else {
              reject();
            }
          }
        )
        .on('error', () => {
          reject();
        });
    });
  }

let projectName;

function init() {
  const program = new commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action(name => {
      projectName = name;
    })
    .option('--verbose', 'print additional logs')
    .option('--info', 'print environment debug info')
    .option(
      '--scripts-version <alternative-package>',
      'use a non-standard version of react-scripts'
    )
    .option(
      '--template <path-to-template>',
      'specify a template for the created project'
    )
    .option('--use-npm')
    .option('--use-pnp')
    .allowUnknownOption()
    .on('--help', () => {
      console.log(
        `    Only ${chalk.green('<project-directory>')} is required.`
      );
      console.log();
      console.log(
        `    A custom ${chalk.cyan('--scripts-version')} can be one of:`
      );
      console.log(`      - a specific npm version: ${chalk.green('0.8.2')}`);
      console.log(`      - a specific npm tag: ${chalk.green('@next')}`);
      console.log(
        `      - a custom fork published on npm: ${chalk.green(
          'my-react-scripts'
        )}`
      );
    })
    .parse(process.argv);

  if (program.info) {
    console.log(chalk.bold('\nEnvironment Info:'));
    console.log(
      `\n  current version of ${packageJson.name}: ${packageJson.version}`
    );
    console.log(`  running from ${__dirname}`);
    return envinfo
      .run(
        {
          System: ['OS', 'CPU'],
          Binaries: ['Node', 'npm', 'Yarn'],
          Browsers: [
            'Chrome',
            'Edge',
            'Internet Explorer',
            'Firefox',
            'Safari',
          ],
          npmPackages: dependenciess,
          npmGlobalPackages: ['create-react-app'],
        },
        {
          duplicates: true,
          showNotFound: true,
        }
      )
      .then(console.log);
  }

  if (typeof projectName === 'undefined') {
    console.error('Please specify the project directory:');
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
    );
    console.log();
    console.log('For example:');
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green('my-react-app')}`
    );
    console.log();
    console.log(
      `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
  }

  // We first check the registry directly via the API, and if that fails, we try
  // the slower `npm view [package] version` command.
  //
  // This is important for users in environments where direct access to npm is
  // blocked by a firewall, and packages are provided exclusively via a private
  // registry.
  checkForLatestVersion()
    .catch(() => {
      try {
        return execSync('npm view create-xiaoma-admin version').toString().trim();
      } catch (e) {
        return null;
      }
    })
    .then(latest => {
      if (latest && semver.lt(packageJson.version, latest)) {
        console.log();
        console.error(
          chalk.yellow(
            `You are running \`create-xiaoma-admin\` ${packageJson.version}, which is behind the latest release (${latest}).\n\n` +
              'We no longer support global installation of Create React App.'
          )
        );
        console.log();
        console.log(
          'Please remove any global installs with one of the following commands:\n' +
            '- npm uninstall -g create-xiaoma-admin\n' +
            '- yarn global remove create-xiaoma-admin'
        );
        console.log();
        console.log(
          'The latest instructions for creating a new app can be found here:\n' +
            'https://create-react-app.dev/docs/getting-started/'
        );
        console.log();
        process.exit(1);
      } else {
        createApp(
          projectName,
          program.verbose,
          program.scriptsVersion,
          program.template,
          program.useNpm,
          program.usePnp
        );
      }
    });
}

function createApp(name, verbose, version, template, useNpm, usePnp) {
    const unsupportedNodeVersion = !semver.satisfies(process.version, '>=10');
    if (unsupportedNodeVersion) {
        console.log(
        chalk.yellow(
            `You are using Node ${process.version} so Please update to Node 10 or higher for a better, fully supported experience.\n\n` 
            )
        );
        return
    }
    const root = path.resolve(name);
    const appName = path.basename(root);
    checkAppName(appName)
    fs.ensureDirSync(name)
    console.log(`Creating a new React app in ${chalk.green(root)}.`);
    const packageJson = {
        name: appName,
        version: '0.1.0',
        private: true,
      };
    fs.writeFileSync(
        path.join(root, 'package.json'),
        JSON.stringify(packageJson, null, 2) + os.EOL
    );
    const originalDirectory = process.cwd();
    run(
        root,
        appName,
        version,
        verbose,
        originalDirectory,
        template,
        usePnp
    )

}

function run(
    root,
    appName,
    version,
    verbose,
    originalDirectory,
    template,
    usePnp
) {
    const allDependencies = dependenciess;
    console.log(
        `Installing ${chalk.cyan('react')}, ${chalk.cyan(
          'react-dom'
        )}...`
      );
    console.log();
    install(
        root,
        usePnp,
        allDependencies,
        verbose,
    ).then(async () => {
        console.log(
            chalk.red(`Installing completed!`)
          );
        await executeNodeScript(
          {
            cwd: process.cwd(),
            args: nodeArgs,
          },
          [root, appName, verbose, originalDirectory, templateName],
          `
        var init = require('xiaoma-react-scripts/scripts/init.js');
        init.apply(null, JSON.parse(process.argv[1]));
      `
      );
    })
}


function executeNodeScript({ cwd, args }, data, source) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [...args, '-e', source, '--', JSON.stringify(data)],
      { cwd, stdio: 'inherit' }
    );

    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `node ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  });
}


function install(
    root,
    usePnp,
    allDependencies,
    verbose,
) {
    return new Promise((resolve, reject) => {
        const command = 'yarn';
        let args = ['add', 'exact'];
        [].push.apply(args, allDependencies);
        args.push('--cwd');
        args.push(root);
        if (verbose) {
            args.push('--verbose');
        }
        const child = spawn(command, args, { stdio: 'inherit' });
        child.on('close', code => {
            if (code !== 0) {
                reject({
                command: `${command} ${args.join(' ')}`,
                });
                return;
            }
            resolve();
        })
    })
        
}

function checkAppName(appName) {
    const validationResult = validateProjectName(appName)
    if (!validationResult.validForNewPackages) {
        console.error(
          chalk.red(
            `Cannot create a project named ${chalk.green(
              `"${appName}"`
            )} because of npm naming restrictions:\n`
          )
        );
        [
            ...(validationResult.errors || []),
            ...(validationResult.warnings || []),
          ].forEach(error => {
            console.error(chalk.red(`  * ${error}`));
          });
          console.error(chalk.red('\nPlease choose a different project name.'));
          process.exit(1);
    }
    const dependencies = dependenciess.sort();
    if (dependencies.includes(appName)) {
        console.error(
        chalk.red(
            `Cannot create a project named ${chalk.green(
            `"${appName}"`
            )} because a dependency with the same name exists.\n` +
            `Due to the way npm works, the following names are not allowed:\n\n`
        ) +
            chalk.cyan(dependencies.map(depName => `  ${depName}`).join('\n')) +
            chalk.red('\n\nPlease choose a different project name.')
        );
        process.exit(1);
    }
}


module.exports = {
    init
};