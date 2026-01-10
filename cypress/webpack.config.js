// cypress/webpack.config.js
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      "process": require.resolve("process/browser"),
      "path": false,
      "fs": false,
      "os": false,
      "crypto": false,
      "stream": false
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
};