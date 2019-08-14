module.exports = {
    presets: ['@vue/app'],
    // 按需导入element的配置
    plugins: [
        [
            'component',
            {
                libraryName: 'element-ui',
                styleLibraryName: 'theme-chalk'
            }
        ]
    ]
};
