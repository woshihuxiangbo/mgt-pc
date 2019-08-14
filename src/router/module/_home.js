export default [
    {
        path: '/home', component: () => import('@/components/layout/MainContainer'),
        name: 'BaseHome',
        meta: {
            title: '',
            name: '首页',
            roleIds: undefined,
            hasSelectStore: false,
            isMenu: false,
            isBase: true
        },
        children: [
            {
                path: 'admin',
                name: 'AdminHome',
                component: () => import('@/views/homePage/admin'),
                meta: {
                    title: '首页',
                    roleIds: ['1'],
                    hasSelectStore: false,
                    isMenu: true,
                    isBase: false
                }
            },
            {
                path: 'default',
                name: 'Home',
                component: () => import('@/views/homePage/defaultHome'),
                meta: {
                    title: '首页',
                    roleIds: ['1'],
                    hasSelectStore: false,
                    isMenu: true,
                    isBase: false
                }
            },
            {
                path: 'inspector',
                name: 'Inspector',
                component: () => import('@/views/homePage/inspector'),
                meta: {
                    title: '首页',
                    roleIds: ['2'],
                    hasSelectStore: false,
                    isMenu: true,
                    isBase: false
                }
            },
            {
                path: 'director', //运营副总监首页
                name: 'Director',
                component: () => import('@/views/homePage/director'),
                meta: {
                    title: '首页',
                    roleIds: ['3'],
                    hasSelectStore: false,
                    isMenu: true,
                    isBase: false
                }
            },
            {
                path: 'managers', //运营经理首页
                name: 'Manager',
                component: () => import('@/views/homePage/manager'),
                meta: {
                    title: '首页',
                    roleIds: ['4'],
                    hasSelectStore: false,
                    isMenu: true,
                    isBase: false
                }
            },
            {
                path: 'welcome', //运营经理首页
                name: 'Welcome',
                component: () => import('@/views/homePage/welcome'),
                meta: {
                    title: '首页',
                    roleIds: ['5', '6', '7', '8', '9', '10', '11', '12'],
                    hasSelectStore: false,
                    isMenu: true,
                    isBase: false
                }
            },
            {
                path: 'noperms', //没有操作权限
                name: 'NoPerms',
                component: () => import('@/views/homePage/noPerms'),
            },
            {
                path: '404', //404找不到页面
                name: '404',
                component: () => import('@/views/homePage/404'),
            }
        ]
    }
]
