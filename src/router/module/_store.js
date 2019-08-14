import Store from '@/router/module/block/_store';

export default [
    {
        path: '/store', component: () => import('@/components/layout/MainContainer'),
        name: 'Store',
        meta: {
            // roleId: ['1', '2', '3', '4', '5', '8', '12', '13'],
            isMenu: true,
            name: '店铺管理',
            key: ['store', 'wholesaleOrder'],
            perms: ['r']
        },
        children: [
            ...Store,
            {
                name: 'ShopAdd',
                path: 'add',
                component: () => import('@/views/store/add'),
                meta: {
                    title: '添加店铺',
                    index: 'shopList',
                    roleId: ['1', '4'],
                    key: 'store',
                    isMenu: false,
                    perms: ['c']
                }
            },
            {
                name: 'ShopAddMain',
                path: 'addMainStore',
                component: () => import('@/views/store/add'),
                meta: {
                    title: '添加店铺',
                    index: 'shopList',
                    roleId: ['1', '4'],
                    key: 'store',
                    perms: ['c']
                }
            },
            {
                name: 'ShopEdit',
                path: 'edit/:id',
                component: () => import('@/views/store/edit'),
                meta: {
                    title: '修改店铺',
                    index: 'shopList',
                    roleId: ['1', '4'],
                    key: 'store',
                    perms: ['u']
                }
            },
            {
                name: 'ShopList',
                path: 'list',
                component: () => import('@/views/store/list'),
                meta: {
                    title: '店铺列表',
                    index: 'shopList',
                    // roleId: ['1', '4', '2', '3', '5'],
                    key: 'store',
                    isMenu: true,
                    perms: ['l']
                }
            },
            {
                name: 'PurchaseItemList',
                path: 'purchase/item/list',
                component: () => import('@/views/purchase/itemList'),
                meta: {
                    title: '商品进货',
                    index: 'purchaseItemList',
                    roleId: ['5', '8'],
                    key: 'wholesaleOrder',
                    isMenu: true,
                    perms: ['c'],
                    scope: 2
                }
            },
            {
                name: 'StoreAddress',
                path: 'address',
                component: () => import('@/views/store/address'),
                meta: {
                    title: '收货地址',
                    index: 'storeAddress',
                    roleId: ['1', '5', '4', '12', '13', '8'],
                    key: 'store',
                    isMenu: true,
                    perms: ['l']
                    // scope: 2
                }
            },
            {
                path: 'select',
                name: 'SelectStore',
                component: () => import('@/views/store/select'),
                meta: {
                    title: '选择店铺',
                    index: 'SelectStore'
                }
            },
            {
                name: 'ShoppingCar',
                path: 'shopping/car',
                component: () => import('@/views/purchase/shoppingCar'),
                meta: {
                    title: '购物车',
                    index: 'shoppingCar',
                    roleId: ['5', '8'],
                    key: 'wholesaleOrder',
                    perms: ['c']
                }
            },
            {
                name: 'StorePostage',
                path: 'store/postage/:id',
                component: () => import('@/views/store/postage'),
                meta: {
                    title: '运费模板设置',
                    roleId: ['1', '5', '8'],
                    key: 'store',
                    perms: ['w']
                }
            },
            {
                name: 'StoreMessage',
                path: 'message/template',
                component: () => import('@/views/store/message'),
                meta: {
                    title: '消息模板',
                    roleId: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
                    key: 'store',
                    perms: ['u'],
                    isMenu: true
                }
            }, {
                name: 'GroupStoreEdit',
                path: 'group/edit',
                component: () => import('@/views/store/groupStoreEdit.vue'),
                meta: {
                    title: '店铺编辑',
                    key: 'store',
                    perms: ['u'],
                    roleId: ['14'],
                    isMenu: true
                }
            }
        ]
    }
];
