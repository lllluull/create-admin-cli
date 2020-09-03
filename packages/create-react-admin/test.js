const execSync = require('child_process').execSync;
const command = 'lerna'
const args = ['add', '--scope=xiaoma-react-scripts']
const packs = {
    "babel-plugin-named-asset-import": "^0.3.6",
    "babel-preset-react-app": "^9.1.2",
    "bfj": "^7.0.2",
    "camelcase": "^6.0.0",
    "case-sensitive-paths-webpack-plugin": "2.3.0",
    "css-loader": "3.6.0",
    "dotenv": "8.2.0",
    "dotenv-expand": "5.1.0",
    "eslint": "^7.5.0",
    "eslint-config-react-app": "^5.2.1",
    "eslint-loader": "^4.0.2",
    "eslint-plugin-flowtype": "^5.2.0",
    "eslint-plugin-import": "^2.22.0",
    "eslint-plugin-jsx-a11y": "^6.3.1",
    "eslint-plugin-react": "^7.20.3",
    "eslint-plugin-react-hooks": "^4.0.8",
    "file-loader": "6.0.0",
    "fs-extra": "^9.0.0",
    "html-webpack-plugin": "4.3.0",
    "identity-obj-proxy": "3.0.0",
    "jest": "26.3.0",
    "jest-circus": "26.3.0",
    "jest-resolve": "26.3.0",
    "jest-watch-typeahead": "0.6.0",
    "mini-css-extract-plugin": "0.9.0",
    "optimize-css-assets-webpack-plugin": "5.0.3",
    "pnp-webpack-plugin": "1.6.4",
    "postcss-flexbugs-fixes": "4.2.1",
    "postcss-loader": "3.0.0",
    "postcss-normalize": "8.0.1",
    "postcss-preset-env": "6.7.0",
    "postcss-safe-parser": "4.0.2",
    "react-app-polyfill": "^1.0.6",
    "react-dev-utils": "^10.2.1",
    "react-refresh": "^0.8.3",
    "resolve": "1.17.0",
    "resolve-url-loader": "3.1.1",
    "sass-loader": "8.0.2",
    "semver": "7.3.2",
    "style-loader": "1.2.1",
    "terser-webpack-plugin": "3.0.7",
    "ts-pnp": "1.2.0",
    "url-loader": "4.1.0",
    "webpack": "4.43.0",
    "webpack-dev-server": "3.11.0",
    "webpack-manifest-plugin": "2.2.0",
    "workbox-webpack-plugin": "5.1.3"
  }


Object.keys(packs).forEach(key => {
    const arsss = [...args, key]
    console.log(`lerna add --scope=xiaoma-react-scripts ${key}`)
    execSync(`lerna add --scope=xiaoma-react-scripts ${key}`)
    // const child = spawn.sync(command, args, { stdio: 'inherit' });
})

// 
