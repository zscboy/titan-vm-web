module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: "http://localhost:7777"
    // headers: {
    //   'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
    // },
    // hot: true, // 禁用缓存并启用热更新
    // inline: true // 确保实时刷新
  },
  assetsDir: "static"
};
