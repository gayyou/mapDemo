const webpack = require("webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default']
      }),
    ],
  },
  publicPath: 'https://qg-oss-static.oss-cn-shenzhen.aliyuncs.com/mytest/',
  lintOnSave: false,
  // devServer: {
  //   proxy: {
  //       '/api': {
  //           target: '',
  //           changeOrigin: true,
  //           ws: true,
  //           pathRewrite: {
  //             '^/api': ''
  //           }
  //       }
  //   }
  // }
}
