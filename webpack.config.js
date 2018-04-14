const path = require('path');

module.exports = {
  entry: './src/optimization.js',
  output: {
    filename: 'optimization.js',
    path: path.resolve(__dirname, 'dist')
  }
};