const webpack = require("webpack")
const path = require("path")
const entryDir = path.join(__dirname, "/src/entry")
const nodeModulesDir = path.join(__dirname, "node_modules")
const baseDir = path.join(__dirname, "/src/base")
const serverConfig = require("./serverConfig.json")

const copyWebpackPlugin = require("copy-webpack-plugin")

const config = {
  watch: true,
  entry: {
    "index": path.join(entryDir, "index.js"),
    "detail": path.join(entryDir, "detail.js"),
    "vendor": ["vue", "element-ui", path.join(baseDir, "util.js"), path.join(baseDir, "api.js")]
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist/js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: [nodeModulesDir]
      },
      {
        test: /\.less/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          }, {
            loader: "css-loader" // translates CSS into CommonJS
          }, {
            loader: "less-loader" // compiles Less to CSS
          }
        ]
      },
　　　 {
　　　　test: /\.(png|jpg)$/,
　　　　loader: 'url-loader'
　　　 },
      {
        test: /\.css/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          transformToRequire: {img: ""}
        }
      }
    ]
  },
  resolve: {
    alias:{'vue$': 'vue/dist/vue.common.js'}
  },
  plugins: [
    new copyWebpackPlugin([
      {from: "./src/imgs", to: "../imgs"},
      {from: "./src/template", to: "../html"},
      {from: "./src/video", to: "../video"},
      {from: "./src/css", to: "../css"}
    ]),
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor", "manifest"]
    })
  ],
  devServer: {
    host: "0.0.0.0",
    contentBase: "./dist",
    compress: true,
    port: 8080,
    proxy: {
      "/api": {
        /*只在连接非生产环境server时需要pathRewrite*/
        pathRewrite: {"^/api": ""},
        changeOrigin: true,
        target: serverConfig.serverUrl
      }
    },
    colors: true
  }
}

module.exports = config
