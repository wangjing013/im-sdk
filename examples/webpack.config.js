const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: "./examples/index.ts",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index_bundle.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  devServer: {
    port: 8888,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./examples/index.html",
    }),
  ],
};
