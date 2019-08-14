const webpack = require('webpack');

module.exports = {
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
        }
        config.plugins.push(new webpack.ProvidePlugin({'window.Quill': 'quill/dist/quill.js'}));
    },
    // lintOnSave: false,

    // 是否为生产环境构建生成 source map？
    productionSourceMap: false,
    outputDir: process.env.VUE_APP_BUILD_DIR,

    devServer: {
        open: process.platform === 'darwin',
        https: false,
        hotOnly: false,
        disableHostCheck: true,
        // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/cli-service.md#配置代理
        proxy: {
            // '/item/m/store/express': {
            //     target: 'http://192.168.2.188:20086/',
            //     changeOrigin: true
            // },
            // '/api/1/v1/item/m': {
            //     target: 'http://192.168.2.188:20086/',
            //     pathRewrite: {'^/api/1/v1': ''},
            //     changeOrigin: true
            // },
            // '/api/user/back/m/': {
            //     target: 'http://192.168.2.156:10010/',
            //     // pathRewrite: {'^/api': ''},
            //     changeOrigin: true
            // },
            // '/api/order/m/': {
            //     target: 'http://192.168.2.222:10010/',
            //     changeOrigin: true
            // },
            //
            // '/api/order/m/eventGroup': {
            //     target: 'http://192.168.10.189:10015',
            //     pathRewrite: {'^/api': ''},
            //     changeOrigin: true
            // },
            '/api': {
                // target: 'http://api.koudejun.com',
                // target: 'http://api.yjk027.com',
                target: 'http://testapi.koudejun.com',
                // target: 'http://api.chuangxiaozhu.com',
                // target: 'http://testapi.koudejun.com',
                // target: 'http://api.chuangxiaozhu.com',
                // target: 'http://192.168.2.250:10010',
                // target: 'http://192.168.10.251:10010',
                changeOrigin: true
            }
        },
        before: (app) => {
        }
    }
};
