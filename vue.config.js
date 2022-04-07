const { defineConfig } = require('@vue/cli-service')
const registerRouter = require('./backand/router')

module.exports = defineConfig({
  transpileDependencies: true,
  /*  全局引入scss变量和mixin */
  css: {
    loaderOptions: {
      sass: {
        additionalData:
          '@import "@/assets/scss/variables.scss";@import "@/assets/scss/mixin.scss";'
      }
    }
  },
  devServer: {
    onBeforeSetupMiddleware(app) {
      registerRouter(app.app)
    }
  }
})
