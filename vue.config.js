const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const ENV = process.env.NODE_ENV
console.log('----------ENV', ENV);

// 拼接路径
const resolve = dir => require('path').join(__dirname, dir)

// 增加环境变量
process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss')

// 基础路径 注意发布之前要先修改这里
let baseUrl = '/'

module.exports = {
    baseUrl: baseUrl, // 根据你的实际情况更改这里
    lintOnSave: false,
    transpileDependencies: [
        resolve('src'),
        resolve('node_modules/vue-echarts'),
        resolve('node_modules/resize-detector')
    ],
    devServer: {
        publicPath: baseUrl, // 和 baseUrl 保持一致
        port: 3094,
        disableHostCheck: true,
        //
        /*
        proxy: {
          "/admin/sys": {
            target: "http://192.168.3.201:8081",
          },
          "/admin/trade": {
            target: "http://192.168.3.201:8082"
          },
          "/admin/wallet": {
            target: "http://192.168.3.201:8077"
          },
          "/admin/fiat": {
            target: "http://192.168.3.201:8083"
          },
          '/admin/activity': {
            target: 'http://192.168.3.201:8081'
          },
          "/admin/config": {
            target: "http://192.168.3.201:8085"
          },
          "/admin/message": {
            target: "http://192.168.3.201:8086"
          },
          "/admin/lever": {
            // logLevel: 'debug',
            target: "http://192.168.3.201:8087"
          },
          "/admin/user": {
            target: "http://192.168.3.201:8084"
          },
          "/admin": {
            target: "http://192.168.3.201:8081"
          }
        }
        */
        // 测试环境
        proxy: {
            "^/admin/": {
                target: "http://testadmin3.fengzzz.com",
                changeOrigin: true,
                ws: true,
                cookieDomainRewrite: 'localhost',
            },
            "^/xt-lever/": {
                target: "http://testadmin3.fengzzz.com",
                changeOrigin: true,
                ws: true,
                cookieDomainRewrite: 'localhost',
            },
            "^/xt-trade/": {
                target: "http://testadmin3.fengzzz.com",
                changeOrigin: true,
                ws: true,
                cookieDomainRewrite: 'localhost',
            },
            "^/xt-fund/": {
                target: "http://testadmin3.fengzzz.com",
                changeOrigin: true,
                ws: true,
                cookieDomainRewrite: 'localhost',
            },
            "^/xt-entrust/": {
                target: "http://testadmin3.fengzzz.com",
                changeOrigin: true,
                ws: true,
                cookieDomainRewrite: 'localhost',
            },
            "^/xt-fund-web/": {
                target: "http://testadmin3.fengzzz.com",
                changeOrigin: true,
                ws: true,
                cookieDomainRewrite: 'localhost',
            },

        }
    },
    css: {
        loaderOptions: {
            // 设置 scss 公用变量文件
            sass: {
                data: `@import '~@/assets/style/public.scss';`
            }
        }
    },
    // webpack的相关配置在这里
    configureWebpack: {
        plugins: [
            // 打包后自动压缩dist.zip
            // 初始化 filemanager-webpack-plugin 插件实例
            new FileManagerPlugin({
                onEnd: {
                    // 首先删除项目根目录下的dist.zip
                    delete: [
                        ENV === 'production' ? './dist.zip' : `./dist.${ENV}.zip`,
                    ],
                    // 然后选择dist文件夹将之打包成dist.zip并放在根目录
                    archive: [
                        {
                            source: './dist',
                            destination: ENV === 'production' ? './dist.zip' : `./dist.${ENV}.zip`
                        },
                    ]
                }
            })
        ]
    },
    // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
    chainWebpack: config => {
        /**
         * 删除懒加载模块的 prefetch preload，降低带宽压力
         * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
         * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
         * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
         */
        config
            .output
            .filename(ENV === 'production' || ENV === 'test' ? 'js/chunk.[chunkhash].js' : "js/[name].chunk..js")
            .end()
        config.plugins
            .delete('prefetch')
            .delete('preload')
        // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
        config.resolve
            .symlinks(true)
        config
            // 开发环境
            .when(process.env.NODE_ENV === 'development',
                // sourcemap不包含列信息
                config => config.devtool('cheap-source-map')
            )
            // 非开发环境
            .when(process.env.NODE_ENV !== 'development', config => {
                config.optimization
                    .minimizer([
                        new UglifyJsPlugin({
                            uglifyOptions: {
                                // 移除 console
                                // 其它优化选项 https://segmentfault.com/a/1190000010874406
                                compress: {
                                    warnings: false,
                                    drop_console: true,
                                    drop_debugger: true,
                                    pure_funcs: ['console.log']
                                }
                            }
                        })
                    ])
            })
        // markdown
        config.module
            .rule('md')
            .test(/\.md$/)
            .use('text-loader')
            .loader('text-loader')
            .end()
        // i18n
        config.module
            .rule('i18n')
            .resourceQuery(/blockType=i18n/)
            .use('i18n')
            .loader('@kazupon/vue-i18n-loader')
            .end()
        // svg
        const svgRule = config.module.rule('svg')
        svgRule.uses.clear()
        svgRule
            .include
            .add(resolve('src/assets/svg-icons/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'd2-[name]'
            })
            .end()
        // image exclude
        const imagesRule = config.module.rule('images')
        imagesRule
            .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
            .exclude
            .add(resolve('src/assets/svg-icons/icons'))
            .end()
        // 重新设置 alias
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@api', resolve('src/api'))
            .set('assets', resolve('src/assets'))
            .set('base', resolve('src/base'))
            .set('config', resolve('src/config'))
            .set('components', resolve('src/components'))
            .set('services', resolve('src/services'))
        // node
        config.node
            .set('__dirname', true)
            .set('__filename', true)
        // babel-polyfill 加入 entry
        const entry = config.entry('app')
        entry
            .add('babel-polyfill')
            .end()
        // 判断环境加入模拟数据
        // if (process.env.VUE_APP_BUILD_MODE !== 'nomock') {
        //   entry
        //     .add('@/mock')
        //     .end()
        // }
    }
}
