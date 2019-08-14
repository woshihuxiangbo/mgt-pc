export default [
    {
        path: '/administrator', component: () => import('@/components/layout/MainContainer'),
        name: 'Administrator',
        meta: {
            title: '',
            name: '管理员',
            hasSelectStore: false,
            isMenu: true,
            isBase: false,
            key: ['manager'],
            perms: ['l']
        },
        children: [
            {
                path: 'manager',
                name: 'AdministratorManager',
                component: () => import('@/views/administrator/manager'),
                meta: {
                    title: '角色管理',
                    key: 'manager',
                    perms: ['r'],
                    hasSelectStore: false,
                    isMenu: true,
                    roleId: ['1', '2', '3', '4'],
                    keepAlive: false
                }
            },
            {
                path: 'list',
                name: 'AdministratorList',
                component: () => import('@/views/administrator/list'),
                meta: {
                    title: '管理员列表',
                    roleId: undefined,
                    key: 'manager',
                    perms: ['l'],
                    isMenu: true
                }
            },
            {
                path: 'add',
                name: 'AdministratorAdd',
                component: () => import('@/views/administrator/add'),
                meta: {
                    title: '创建管理员',
                    roleId: undefined,
                    key: 'manager',
                    perms: ['c']
                }
            },
            {
                path: 'edit/:id',
                name: 'AdministratorEdit',
                component: () => import('@/views/administrator/edit'),
                meta: {
                    title: '编辑管理员',
                    roleId: undefined,
                    key: 'manager',
                    perms: ['u']
                }
            },
            {
                name: 'AdministratorBank',
                path: 'bank',
                component: () => import('@/views/administrator/bank'),
                meta: {
                    title: '银行信息',
                    roleId: undefined,
                    key: 'systemBank',
                    perms: 'l',
                    isMenu: false
                }
            },
            {
                name: 'AdministratorSetting',
                path: 'setting',
                component: () => import('@/views/administrator/setting'),
                meta: {
                    title: '设置',
                    roleId: ['1', '2'],
                    isMenu: false
                }
            }
        ]
    }
];
