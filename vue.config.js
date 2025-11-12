const path = require('path')
const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./config/plugin.config')


function resolve(dir) {
  return path.join(__dirname, dir)
}

const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
      // '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
      // '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
      // '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
      // '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
      '/static/dist/vue.min.js',
    '/static/dist/vue-router.min.js',
    '/static/dist/vuex.min.js',
    '/static/dist/axios.min.js'
  ]
}

// vue.config.js
const vueConfig = {
  publicPath: isProd ? './' : './',
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    // if prod, add externals
    externals: isProd ? assetsCDN.externals : {}
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    // if prod is on
    // assets require on cdn
    if (isProd) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
      // 清除css，js版本号
      config.output.filename('js/[name].js?t=[contentHash]').end();
      config.output.chunkFilename('js/[name].js?t=[contentHash]').end();
      // 修改版本号配置
      config.plugin('extract-css').tap(args => [{
        filename: 'css/[name].css?t=[contentHash]',
        chunkFilename: 'css/[name].css?t=[contentHash]'
      }])
    }
    if (process.env.NODE_ENV === 'production') {
      // 去除console语句 yarn add terser-webpack-plugin -D
      config.optimization.minimizer('terser').tap(args => {
          args[0].terserOptions.compress.drop_console = true
          return args
      })
    }
    // 移除 prefetch 插件（解决首次进入页面所有资源预加载）
    config.plugins.delete('prefetch');
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          'border-radius-base': '2px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  // configureWebpack: config => { // webpack配置，值位对象时会合并配置，为方法时会改写配置
  //   if (debug) { // 开发环境配置
  //     config.devtool = 'eval-source-map',
  //     config.cacheBusting = false
  //   } else { // 生产环境配置
  //   }
  // },

  devServer: {
    port: 8086,
    disableHostCheck: true
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    // proxy: {
    //   '/api': {
    //     target: baseUrl,
    //     // ws: false,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': '/api'
    //     }
    //   }
    // }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: [],
  outputDir: '../platform',
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  console.log('VUE_APP_PREVIEW', true)
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
