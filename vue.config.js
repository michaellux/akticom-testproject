const { defineConfig } = require("@vue/cli-service");
const VueMacros = require("unplugin-vue-macros/webpack");
module.exports = defineConfig({
  transpileDependencies: true,
  parallel: false,
  configureWebpack: {
    plugins: [VueMacros({})],
  },
});
