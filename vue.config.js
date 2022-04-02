const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  /**
   * 全局引入scss变量和mixin
   */
  css: {
    loaderOptions: {
      sass: {
        additionalData:
          '@import "@/assets/scss/variable.scss";@imprt "@/assets/scss/mixin.scss";'
      }
    }
  }
})
