module.exports = {
    title: 'OceanGo',
    description: 'OceanGo document 框架v1.0.0目前没有开发完成，已开发的模块的健壮性也有待测试，文档内容内部参加即可，不能宣传文档',
    locales: {
        // 键名是该语言所属的子路径
        // 作为特例，默认语言可以使用 '/' 作为其路径。
        '/': {
            lang: 'en-US', // 将会被设置为 <html> 的 lang 属性
        },
        '/zh/': {
            lang: 'zh-CN',
        }
    },
    themeConfig: {
        locales: {
            '/': {
                selectText: 'Languages',
                label: 'English',
                ariaLabel: 'Languages',
                editLinkText: 'Edit this page on GitHub',
                serviceWorker: {
                    updatePopup: {
                        message: "New content is available.",
                        buttonText: "Refresh"
                    }
                },
                nav: [
                    { text: 'Home', link: '/' },
                    { text: 'quick-start', link: '/quick-start/', ariaLabel: 'QuickStart'},
                    { text: 'GitHub', link: 'https://github.com/oceango/oceango' },
                ],
                sidebar: [
                    ['/',  '主页'],
                    ['/quick-start.md', '快速入门']
                ]
            },
            '/zh/': {
                selectText: '选择语言',
                label: '简体中文',
                editLinkText: '在 GitHub 上编辑此页',
                // Service Worker 的配置
                serviceWorker: {
                    updatePopup: {
                        message: "发现新内容可用.",
                        buttonText: "刷新"
                    }
                },
                nav: [
                    { text: '主页', link: '/' },
                    { text: '快速入门   ', link: '/quick-start/', ariaLabel: 'QuickStart'},
                    { text: 'GitHub', link: 'https://github.com/oceango/oceango' },
                ],
                sidebar: [
                    ['/',  '主页'],
                    ['/quick-start.md', '快速入门']
                ]
            }
        }
    }
}
