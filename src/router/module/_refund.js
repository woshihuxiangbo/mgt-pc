export default [{
    path: '/refund', component: () => import('@/components/layout/MainContainer'),
    name: 'Refund',
    meta: {
        name: '售后服务',
        // roleId: ['1', '2', '3', '4', '5', '6', '8', '9'],
        isMenu: true,
        key: ['wholesaleOrder', 'retailOrder'],
        perms: ['l']
    },
    children: [
        {
            name: 'OrderRetailRefundList',
            path: 'retail',
            component: () => import('@/views/refund/retail'),
            meta: {
                title: '零售售后订单',
                // roleId: ['1', '2', '3', '4', '5', '8', '6', '9'],
                key: 'retailOrder',
                perms: ['l'],
                isMenu: true
            }
        },
        {
            name: 'OrderRetailRefundEdit',
            path: 'retail/:id',
            component: () => import('@/views/refund/retailDetail'),
            meta: {
                title: '售后详情',
                // roleId: ['1', '2', '3', '4', '5', '8', '6', '9'],
                key: 'retailOrder',
                perms: ['r'],
                isMenu: false
            }
        },
        {
            name: 'OrderWholesaleRefundList',
            path: 'wholesale',
            component: () => import('@/views/refund/wholesale'),
            meta: {
                title: '批发售后订单',
                // roleId: ['1', '2', '3', '4', '5', '8', '6', '9'],
                key: 'wholesaleOrder',
                perms: ['l'],
                isMenu: true
            }
        },
        {
            name: 'OrderWholesaleRefundDetail',
            path: 'wholesale/:id',
            component: () => import('@/views/refund/wholesaleDetail'),
            meta: {
                title: '售后详情',
                // roleId: ['1', '2', '3', '4', '5', '8', '6', '9'],
                key: 'wholesaleOrder',
                perms: ['r'],
                isMenu: false
            }
        }
    ]
}];