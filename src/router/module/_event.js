export default [{
    path: '/shop/event', component: () => import('@/components/layout/MainContainer'),
    name: 'Event',
    meta: {
        name: '活动管理',
        // roleId: ['1', '2', '3', '4', '5'],
        isMenu: true,
        key: ['event'],
        perms: ['l']
    },
    children: [
        // {
        //     name: 'StoreCouponList',
        //     path: 'store/coupon/list',
        //     component: () => import('@/views/shop/event/storeCoupon/list'),
        //     meta: {
        //         title: '入店礼包代金券',
        //         index: 'couponList',
        //         // roleId: ['1', '4', '2', '3', '5'],
        //         key: 'event',
        //         perms: ['l'],
        //         isMenu: true
        //     }
        // },
        {
            name: 'IncomingPackageList',
            path: 'incoming/package/list',
            component: () => import('@/views/shop/event/incomingPackage/list'),
            meta: {
                title: '入店礼包',
                index: 'incomingPackageList',
                // roleId: ['1', '4', '2', '3', '5'],
                key: 'event',
                perms: ['l'],
                isMenu: true
            }
        },
        {
            name: 'EventCouponList',
            path: 'coupon/list',
            component: () => import('@/views/shop/event/coupon/list'),
            meta: {
                title: '代金券',
                index: 'couponList',
                key: 'event',
                perms: ['l'],
                isMenu: true
            }
        },
        {
            name: 'EventCheckinList',
            path: 'checkin/list',
            component: () => import('@/views/shop/event/checkin/list'),
            meta: {
                title: '签到',
                index: 'couponList',
                key: 'event',
                perms: ['l'],
                isMenu: true
            }
        },
        // {
        //     name: 'FreeGiftList',
        //     path: 'free/gift/list',
        //     component: () => import('@/views/shop/event/freeGift/list'),
        //     meta: {
        //         title: '免费礼品',
        //         index: 'freeGiftList',
        //         // roleId: ['1', '4', '2', '3', '5'],
        //         key: 'event',
        //         perms: ['l'],
        //         isMenu: true
        //     }
        // },
        {
            name: 'FreeGiftOrder',
            path: 'free/gift/order',
            component: () => import('@/views/shop/event/freeGift/orderList'),
            meta: {
                title: '领取记录',
                // roleId: ['1', '4', '2', '3', '5'],
                key: 'event',
                perms: ['l'],
                isMenu: false
            }
        },
        {
            name: 'FreeGiftEdit',
            path: 'free/gift/edit/:id',
            component: () => import('@/views/shop/event/freeGift/edit'),
            meta: {
                title: '修改礼包',
                index: 'freeGiftList',
                // roleId: ['1', '4'],
                key: 'event',
                perms: ['u']
            }
        },
        {
            name: 'FreeGiftAdd',
            path: 'free/gift/add',
            component: () => import('@/views/shop/event/freeGift/add'),
            meta: {
                title: '新增礼包',
                index: 'event',
                // roleId: ['1', '4'],
                key: 'event',
                perms: ['c']
            }
        },

        {
            name: 'IncomingPackageGetList',
            path: 'incoming/package/get/list/:id',
            component: () => import('@/views/shop/event/incomingPackage/getList'),
            meta: {
                title: '领取列表',
                // roleId: ['1', '4', '2', '3', '5'],
                key: 'event',
                perms: ['l']
            }
        },
        {
            name: 'IncomingPackageAdd',
            path: 'incoming/package/add',
            component: () => import('@/views/shop/event/incomingPackage/add'),
            meta: {
                title: '创建入店礼包',
                index: 'incomingPackageList',
                // roleId: ['1', '4'],
                key: 'event',
                perms: ['c']
            }
        },
        {
            name: 'IncomingPackageEdit',
            path: 'incoming/package/edit/:id',
            component: () => import('@/views/shop/event/incomingPackage/edit'),
            meta: {
                title: '编辑入店礼包',
                index: 'incomingPackageList',
                // roleId: ['1', '4'],
                key: 'event',
                perms: ['u']
            }
        },
        {
            name: 'IncomingPackageOrder',
            path: 'incoming/package/order',
            component: () => import('@/views/shop/event/incomingPackage/orderList'),
            meta: {
                title: '领取记录',
                // roleId: ['1', '4', '2', '3', '5'],
                key: 'event',
                perms: ['l'],
                isMenu: false
            }
        },
        {
            name: 'CouponReceive',
            path: 'store/coupon/receive/:couponId',
            component: () => import('@/views/shop/event/storeCoupon/receive'),
            meta: {
                title: '领取列表',
                index: 'couponReceive',
                key: 'event',
                perms: ['l']
            }
        },
        // {
        //     name: 'ItemLimitPurchase',
        //     path: 'item/limit/purchase',
        //     component: () => import('@/views/shop/limit/purchase'),
        //     meta: {
        //         title: '限购管理',
        //         key: 'item',
        //         perms: ['u'],
        //         isMenu: true
        //     }
        // },
         {
            name: 'EventCouponReceivingRecords',
            path: 'coupon/receiving/records/:type',
            component: () => import('@/views/shop/event/receiving/records'),
            meta: {
                title: '领取记录',
                key: 'event',
                perms: ['l'],
                isMenu: false
            }
        }, {
            name: 'EventGroupList',
            path: 'group/list',
            component: () => import('@/views/shop/event/group/list'),
            meta: {
                title: '团购',
                key: 'event',
                perms: ['l'],
                isMenu: true
            }
        }, {
            name: 'EventGroupEdit',
            path: 'group/edit/:id',
            component: () => import('@/views/shop/event/group/edit'),
            meta: {
                title: '团购',
                key: 'event',
                perms: ['u'],
                isMenu: false
            }
        },
        {
            name: 'EventGroupAdd',
            path: 'group/add',
            component: () => import('@/views/shop/event/group/add'),
            meta: {
                title: '团购',
                key: 'event',
                perms: ['c'],
                isMenu: false
            }
        },
        {
            name: 'EventSpikeList',
            path: 'spike/list',
            component: () => import('@/views/shop/event/spike/list'),
            meta: {
                title: '秒杀',
                key: 'event',
                perms: ['l'],
                isMenu: true
            }
        },
        {
            name: 'EventSpikeAdd',
            path: 'spike/add',
            component: () => import('@/views/shop/event/spike/add'),
            meta: {
                title: '创建秒杀',
                key: 'event',
                perms: ['c'],
                isMenu: false
            }
        },
        {
            name: 'EventSpikeEdit',
            path: 'spike/edit/:id',
            component: () => import('@/views/shop/event/spike/edit'),
            meta: {
                title: '编辑秒杀',
                key: 'event',
                perms: ['c'],
                isMenu: false
            }
        },
        {
            name: 'EventBargainList',
            path: 'bargain/list',
            component: () => import('@/views/shop/event/bargain/list'),
            meta: {
                title: '砍价',
                key: 'event',
                perms: ['l'],
                isMenu: true
            }
        },
        {
            name: 'EventBargainAdd',
            path: 'bargain/add',
            component: () => import('@/views/shop/event/bargain/add'),
            meta: {
                title: '创建砍价',
                key: 'event',
                perms: ['c'],
                isMenu: false
            }
        },
        {
            name: 'EventBargainEdit',
            path: 'bargain/edit/:id',
            component: () => import('@/views/shop/event/bargain/edit'),
            meta: {
                title: '编辑砍价',
                key: 'event',
                perms: ['c'],
                isMenu: false
            }
        }
    ]
}];
