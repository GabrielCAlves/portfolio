const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/',
  outputDir: 'dist',
  indexPath: 'index.html',
  transpileDependencies: true,
  lintOnSave: false,
  pwa: {
    iconPaths: {
      favicon32: 'favicon-32x32.png',
      favicon16: 'favicon-16x16.png',
      appleTouchIcon: 'apple-touch-icon.png',
      maskIcon: 'safari-pinned-tab.svg',
      msTileImage: 'mstile-150x150.png'
    }
  }
})
