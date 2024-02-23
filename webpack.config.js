const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
module.exports = {
  mode: "development",
  entry: {
    popup: "./src/popup.js",
    content: "./src/content.js"
  },
  output: {
    // We want to create the JavaScript bundles under a
    // 'static' directory
    filename: "static/[name].js",
    // Absolute path to the desired output directory. In our
    // case a directory named 'dist'
    // '__dirname' is a Node variable that gives us the absolute
    // path to our current directory. Then with 'path.resolve' we
    // join directories
    // Webpack 4 assumes your output path will be './dist' so you
    // can just leave this
    // entry out.
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  // Change to production source maps
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js.?)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: [
          {
            // We configure 'MiniCssExtractPlugin'
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                exportLocalsConvention: "camelCaseOnly",
                namedExport: true,
              },
              sourceMap: true,
              importLoaders: 1,
            },
          },
          {
            // PostCSS will run before css-loader and will
            // minify and autoprefix our CSS rules.
            loader: "postcss-loader",
          },
        ],
      },
    ],
  },
  optimization: {
    //splitChunks: {
    //  cacheGroups: {
    //    styles: {
    //      name: "styles",
    //      test: /\.css$/,
    //      chunks: "all",
    //      enforce: true,
    //    },
    //    vendor: {
    //      chunks: "initial",
    //      test: "vendor",
    //      name: "vendor",
    //      enforce: true,
    //    },
    //  },
    //},
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/popup-entry.html",
      favicon: "public/favicon.ico",
      excludeChunks: ["content"]
    }),

    // Create the stylesheet under 'styles' directory
    new MiniCssExtractPlugin({
      filename: "styles/styles.[hash].css",
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: "./public/manifest.json", to: "manifest.json" },
        { from: "./public/icons", to: "icons" },
      ],
    }),
  ],
}
