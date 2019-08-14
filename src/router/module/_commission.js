export default [{
    path: '/commission', component: () => import('@/components/layout/MainContainer'),
    name: 'Commission',
    meta: {
        name: '佣金管理',
        key: ['income'],
        perms: ['l'],
        isMenu: true
    },
    children: [
        {
            path: 'transfer/review', component: () => import('@/views/commission/transferReview'),
            name: 'CommissionTransferReview',
            meta: {
                title: '佣金转账审核',
                key: ['income'],
                perms: ['l'],
                isMenu: true
            }
        },
        {
            path: 'transfer/details', component: () => import('@/views/commission/transferDetails'),
            name: 'CommissionTransferDetails',
            meta: {
                title: '佣金转账明细',
                key: ['income'],
                perms: ['l'],
                isMenu: true
            }
        },
        {
            path: 'item/profit', component: () => import('@/views/commission/itemProfit'),
            name: 'CommissionItemProfit',
            meta: {
                title: '普通商品盈利',
                key: ['income'],
                perms: ['l'],
                isMenu: true
            }
        },
        {
            path: 'group/item/profit', component: () => import('@/views/commission/groupItemProfit'),
            name: 'CommissionGroupItemProfit',
            meta: {
                title: '团购商品盈利',
                key: ['income'],
                perms: ['l'],
                isMenu: true
            }
        }
    ]
}];
