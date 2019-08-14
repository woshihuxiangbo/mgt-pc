import category from './group/_category';

let roleIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

export default [{
    path: '/group', component: () => import('@/components/layout/MainContainer'),
    name: 'Group',
    meta: {
        name: '社区团购',
        roleId: roleIds,
        isMenu: true,
        key: ['groupItem', 'groupLeader', 'item'],
        perms: ['l']
    },
    children: [
        {
            name: 'groupGoods',
            path: 'item/list',
            component: () => import('@/views/salesman/group/goods/list'),
            meta: {
                title: '团购商品',
                index: 'groupGoods',
                roleId: roleIds,
                key: 'item',
                perms: ['l'],
                isMenu: true,
                query: {
                    isGroupStoreItem: true
                }
            }
        },
        ...category,
        {
            name: 'ShoppingGroupEvent',
            path: 'event',
            component: () => import('@/views/group/event'),
            meta: {
                title: '团购管理',
                roleId: roleIds,
                key: 'event',
                perms: ['l'],
                isMenu: true
            }
        },
        {
            name: 'groupGoodsAdd',
            path: 'item/add',
            component: () => import('@/views/salesman/group/goods/add'),
            meta: {
                title: '团购商品-添加',
                index: 'groupGoods',
                roleId: roleIds,
                key: 'item',
                perms: ['c'],
                query: {
                    isGroupStoreItem: true
                }
            }
        },
        {
            name: 'groupGoodsEdit',
            path: 'item/edit/:id',
            component: () => import('@/views/salesman/group/goods/edit'),
            meta: {
                title: '团购商品-编辑',
                index: 'groupGoods',
                roleId: roleIds,
                key: 'item',
                perms: ['u']

            }
        },
        {
            name: 'groupGoodsInventory',
            path: 'item/inventory/:id',
            component: () => import('@/views/salesman/group/inventory/list'),
            meta: {
                title: '团购商品-库存',
                index: 'groupGoods',
                roleId: roleIds,
                key: 'item',
                perms: ['l']

            }
        },
        {
            name: 'ItemVerifyList',
            path: 'item/verify',
            component: () => import('@/views/salesman/verify/list'),
            meta: {
                title: '审核团长商品',
                key: 'verify',
                perms: ['f', 's', 't'],
                isMenu: true
            }
        },
        {
            name: 'ShoppingGroupApproval',
            path: 'approval',
            component: () => import('@/views/group/approval'),
            meta: {
                title: '团长审批',
                index: 'shoppingGroupApproval',
                roleId: roleIds,
                key: 'groupLeader',
                perms: ['l'],
                isMenu: true
            }
        },
        {
            name: 'ShoppingGroupLeaderList',
            path: 'leader/list',
            component: () => import('@/views/group/leaderList'),
            meta: {
                title: '团长列表',
                index: 'shoppingGroupLeaderList',
                roleId: roleIds,
                key: 'groupLeader',
                perms: ['l'],
                isMenu: true
            }
        },
        {
            name: 'ShoppingGroupOrder',
            path: 'order',
            component: () => import('@/views/order/retail'),
            meta: {
                title: '团购订单',
                roleId: roleIds,
                key: 'groupLeader',
                perms: ['l'],
                isMenu: true,
                query: {
                    eventType: 3
                }
            }
        },
        {
            name: 'ShopStreet',
            path: 'shop/street',
            component: () => import('@/views/group/shopStreet'),
            meta: {
                title: '店铺街管理',
                roleId: roleIds,
                key: 'groupLeader',
                perms: ['l'],
                isMenu: true
            }
        },
    ]
}];
