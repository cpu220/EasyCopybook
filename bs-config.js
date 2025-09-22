/*
 * 配置lite-server服务器以支持CORS（跨域资源共享）
 * 解决Chrome浏览器中的strict-origin-when-cross-origin问题
 */
module.exports = {
  // 监听的文件类型
  files: ['./**/*.{html,htm,css,js,json,mp3}'],
  // 设置injectChanges为false，因为我们不需要在页面上注入CSS变更
  injectChanges: false,
  // 服务器配置
  server: {
    // 静态文件根目录
    baseDir: './node_modules/cnchar-data',
    // 中间件配置，用于处理CORS
    middleware: [
      // 第一个中间件：处理JSONP请求
      function(req, res, next) {
        // 检查URL中是否包含回调函数参数
        if (req.url.indexOf('callback=') !== -1) {
          // 设置内容类型为JavaScript
          res.setHeader('Content-Type', 'application/javascript');
          // 如果是OPTIONS请求（预检请求），则设置相应的CORS头
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            next();
            return;
          }
        }
        // 继续处理下一个中间件
        next();
      },
      // 第二个中间件：设置CORS头信息
      function(req, res, next) {
        // 设置允许所有来源访问
        res.setHeader('Access-Control-Allow-Origin', '*');
        // 设置允许的HTTP方法
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // 设置允许的请求头
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // 设置允许凭证（如cookies）
        res.setHeader('Access-Control-Allow-Credentials', true);
        // 继续处理下一个中间件
        next();
      }
    ]
  },
  // 服务器端口号
  port: 3002
};