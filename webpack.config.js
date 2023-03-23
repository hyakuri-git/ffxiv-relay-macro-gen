const path = require('path');

module.exports = {
  mode: process.NODE_ENV || "development",
  entry: './src/index.js',
  target: "node",
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: [
          {
            loader: "native-addon-loader",
            options: { name: "[name]-[hash].[ext]" }
          }
        ]
      }
    ]
  },
  resolve: {
    fallback: { "path": false },
  },
};
