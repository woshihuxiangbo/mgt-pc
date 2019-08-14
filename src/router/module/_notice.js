export default [
    {
        path: '/notice', component: () => import('@/components/layout/MainContainer'),
        name: 'notice',
        meta: {
            isMenu: true,
            roleId: ['1', '5', '7'],
            name: '财务管理',
            key: ['retailOrder', 'wholesaleOrder'],
            perms: ['r']
        },
        children: [
            {
                name: 'noticeSaasEdit',
                path: 'saas/edit',
                component: () => import('@/views/notice/saas/edit'),
                meta: {
                    title: '平台财务',
                    index: 'noticeSaas',
                    roleId: ['1', '7']
                }
            },
            {
                name: 'noticeSaas',
                path: 'saas',
                component: () => import('@/views/notice/saas'),
                meta: {
                    title: '平台财务',
                    roleId: ['1', '7'],
                    isSaas: process.env.VUE_APP_IS_SAAS !== 'false',
                    isMenu: true
                }
            },
            {
                name: 'noticeWx',
                path: 'wx/program',
                component: () => import('@/views/notice/wx'),
                meta: {
                    title: '店铺财务',
                    roleId: ['1', '5', '7'],
                    isMenu: true
                }
            }
        ]
    }
];
