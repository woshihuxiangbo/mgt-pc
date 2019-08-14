export default [{
    path: '/adv', component: () => import('@/components/layout/MainContainer'),
    name: 'Adv',
    meta: {
        name: '广告管理',
        isMenu: true,
        // roleId: ['1', '4', '2', '3', '5', ''],
        key: 'adv',
        perms: ['l'],
    },
    children: [
        {
            name: 'advList',
            path: 'list',
            component: () => import('@/views/adv/list'),
            meta: {
                title: '广告列表',
                index: 'advList',
                // roleId: ['1', '4', '2', '3', '5'],
                key: 'adv',
                perms: ['l'],
                isMenu: true
            },
        },
        {
            name: 'advImgList',
            path: 'img/list/:id',
            component: () => import('@/views/adv/img/list'),
            meta: {
                title: '广告图片管理',
                index: 'advList',
                // roleId: ['1', '4', '2', '3', '5'],
                key: 'adv',
                perms: ['l']

            },
        },
        {
            name: 'advImgEdit',
            path: 'img/edit/:id',
            component: () => import('@/views/adv/img/edit'),
            meta: {
                title: '广告图片管理-编辑',
                index: 'advList',
                // roleId: ['1', '4'],
                key: 'adv',
                perms: ['u']
            },
        },
        {
            name: 'advImgAdd',
            path: 'img/add/:id',
            component: () => import('@/views/adv/img/add'),
            meta: {
                title: '广告图片管理-添加',
                index: 'advList',
                // roleId: ['1', '4'],
                key: 'adv',
                perms: ['c']
            },
        },
    ]
}]