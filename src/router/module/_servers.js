// 客服
export default [{
    path: '/services', component: () => import('@/components/layout/MainContainer'),
    name: 'Services',
    meta: {
        name: '客服',
        roleId: ['1', '2', '3', '4', '5', '6', '8', '9'],
        // isMenu: true,
        key: ['wholesaleOrder', 'retailOrder'],
    },
    children: [
        {
            name: 'SaasServices',
            path: 'wholesale',
            component: () => import('@/views/servers/wholesale'),
            meta: {
                title: '平台客服',
                index: 'saasServices',
                roleId: [],
                key: 'wholesaleOrder',
                perms: ['r'],
                // isMenu: true
            }
        },
        {
            name: 'WxServices',
            path: 'retail',
            component: () => import('@/views/servers/retail'),
            meta: {
                title: '店铺客服',
                index: 'wxServices',
                roleId: [],
                key: 'retailOrder',
                perms: ['r'],
                // isMenu: true
            }
        }
    ]
}]
