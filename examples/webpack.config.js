const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
module.exports = {
  mode: "development",
  entry: "./examples/index.ts",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index_bundle.js",
  },
  resolve: {
    extensions: [".ts", ".vue", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      $warpper: path.resolve(__dirname, "../src"),
    },
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
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./examples/index.html",
    }),
    new VueLoaderPlugin(),
  ],
};
