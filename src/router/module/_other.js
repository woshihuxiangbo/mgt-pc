const routes = [
    {
        path: '/event/spike/list',
        name: 'SpikeList',
        component: () => import('@/views/event/spike/list'),
        meta: {
            title: '秒杀活动列表',
            index: 'spikeList',
            roleId: undefined,
            key:'event',
            perms: ['r']
        }
    },
    {
        path: '/event/spike/edit/:id',
        name: 'SpikeEdit',
        component: () => import('@/views/event/spike/edit'),
        meta: {
            title: '编辑活动',
            index: 'spikeList',
            roleId: undefined,
            key:'event',
            perms: ['w']
        }
    },
    {
        path: '/event/spike/add',
        name: 'SpikeAdd',
        component: () => import('@/views/event/spike/add'),
        meta: {
            title: '创建活动',
            index: 'spikeList',
            roleId: undefined,
            key:'event',
            perms: ['w']
        }
    },
    {
        path: '/event/coupon/list',
        name: 'ActivityCouponList',
        component: () => import('@/views/event/coupon/list'),
        meta: {
            title: '代金券',
            index: 'activityCouponList',
            roleId: undefined,
            key:'event',
            perms: ['r']
        }
    },
    {
        path: '/event/coupon/add',
        name: 'ActivityCouponAdd',
        component: () => import('@/views/event/coupon/add'),
        meta: {
            title: '代金券',
            index: 'activityCouponList',
            roleId: undefined,
            key:'event',
            perms: ['w']
        }
    },
    {
        path: '/event/coupon/edit/:id',
        name: 'ActivityCouponEdit',
        component: () => import('@/views/event/coupon/edit'),
        meta: {
            title: '代金券',
            index: 'activityCouponList',
            roleId: undefined,
            key:'event',
            perms: ['w']
        }
    },
    // #shop
    {
        path: '/shop/store/edit',
        name: 'ShopStoreEdit',
        component: () => import('@/views/shop/store/edit'),
        meta: {
            title: '修改店铺',
            // index: 'shopArticleList',
            roleId: undefined,
            key:'store',
            perms: ['w']
        }
    },
    {
        path: '/shop/article/list',
        name: 'ShopArticleList',
        component: () => import('@/views/shop/article/list'),
        meta: {
            title: '文章列表',
            index: 'shopArticleList',
            roleId: undefined,
            key:'article',
            perms: ['r']
        }
    },
    {
        path: '/shop/article/edit/:id',
        name: 'ShopArticleEdit',
        component: () => import('@/views/shop/article/edit'),
        meta: {
            title: '编辑文章',
            index: 'shopArticleList',
            roleId: undefined,
            key:'article',
            perms: ['w']
        }
    },
    {
        path: '/shop/article/add',
        name: 'ShopArticleAdd',
        component: () => import('@/views/shop/article/add'),
        meta: {
            title: '创建文章',
            index: 'shopArticleList',
            roleId: undefined,
            key:'article',
            perms: ['w']
        }
    },
    {
        name: 'ShopOrderWholesale',
        path: '/shop/order/wholesale',
        component: () => import('@/views/shop/order/wholesale'),
        meta: {
            title: '订货订单',
            index: 'shopOrderWholesale',
            roleId: undefined,
            key:'order',
            perms: ['r']
        }
    },
    {
        name: 'ShopOrderRetail',
        path: '/shop/order/retail',
        component: () => import('@/views/shop/order/retail'),
        meta: {
            title: '零售订单',
            index: 'shopOrderRetail',
            roleId: undefined,
            key:'order',
            perms: ['r']
        }
    },
    {
        name: 'ShopGroup',
        path: '/shop/event/group/list',
        component: () => import('@/views/group/list'),
        meta: {
            title: '社区团购',
            index: 'shoppingGroup',
            roleId: undefined,
            key:'event',
            perms: ['r']
        }
    },
    // {
    //     name: 'ShopGroupShelves',
    //     path: '/shop/event/group/shelves',
    //     component: () => import('@/views/shop/event/group/shelves'),
    //     meta: {
    //         title: '已上架商品',
    //         index: 'ShopGroupShelves'
    //     }
    // },
    // {
    //     name: 'ShopGroupGoShelves',
    //     path: '/shop/event/group/goshelves',
    //     component: () => import('@/views/shop/event/group/goShelves'),
    //     meta: {
    //         title: '上架商品',
    //         index: 'ShopGroupGoShelves'
    //     }
    // },
];

export default routes
