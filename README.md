# 部署方式

1. 在服务器安装 Node.js (推荐 7.2.0)

2. 从 git 仓库摘取代码

3. 进入 `fe` 文件夹

4. 运行 `npm install`

5. 运行 `npm run build`

6. 将服务器所设置的静态文件路径指向 `dist` 文件夹即可

# 关闭api代理

1. 将 webpack.config.js 中 `devServer.proxy` 属性去掉

2. 将 `fe/src/base/api.js` 第一行的 `let proxyMode = true` 改成 `let proxyMode = false`