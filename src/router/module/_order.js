export default [{
    path: '/order', component: () => import('@/components/layout/MainContainer'),
    name: 'Order',
    meta: {
        name: '订单管理',
        // roleId: ['1', '2', '3', '4', '5', '6', '8', '9'],
        isMenu: true,
        key: ['wholesaleOrder', 'retailOrder'],
        perms: ['l']
    },
    children: [
        {
            name: 'OrderWholesale',
            path: 'wholesale',
            component: () => import('@/views/order/wholesale'),
            meta: {
                title: '批发订单',
                index: 'orderWholesale',
                // roleId: ['1', '2', '3', '4', '5', '8', '6', '9'],
                key: 'wholesaleOrder',
                perms: ['l'],
                isSaas: process.env.VUE_APP_IS_SAAS !== 'false',
                isMenu: true
            }
        },
        // {
        //     name: 'OrderRetail',
        //     path: 'retail',
        //     component: () => import('@/views/order/retail'),
        //     meta: {
        //         title: '零售订单',
        //         index: 'orderRetail',
        //         // roleId: ['1', '2', '3', '4', '5', '8', '6', '9'],
        //         key: 'retailOrder',
        //         perms: ['l'],
        //         isMenu: true
        //     }
        // },
        {
            name:'OrderRetail1',
            path:'OrderRetail1',
            component:() => import('@/views/order/retail1'),
            meta:{
                title:'零售订单',
                isMenu:true
            }
        },
        {
            name:'tuan',
            path:'tuan',
            component:() => import('@/views/order/retail1'),
            meta:{
                title:'拼团订单',
                isMenu:true
            }
        },
        {
            name:'kan',
            path:'kan',
            component:() => import('@/views/order/retail1'),
            meta:{
                title:'砍价订单',
                isMenu:true
            }
        },
        {
            name:'kill',
            path:'kill',
            component:() => import('@/views/order/retail1'),
            meta:{
                title:'秒杀订单',
                isMenu:true
            }
        }
    ]
}];
