export default [
    {
        path: '/item', component: () => import('@/components/layout/MainContainer'),
        name: 'Item',
        meta: {
            name: '商品管理',
            isMenu: true,
            // roleId: ['1', '2', '3', '4', '5', '11', '13', '12', '7', '6', ''],
            key: ['item', 'brand'],
            perms: ['l']
        },
        children: [
            {
                name: 'salesmanGoods',
                path: 'goods',
                component: () => import('@/views/salesman/goods/list'),
                meta: {
                    title: '商品管理',
                    index: 'salesmanGoods',
                    // roleId: ['1', '2', '3', '5', '4', '11'],
                    key: 'item',
                    perms: ['l'],
                    isMenu: true
                }
            },
            {
                name: 'salesmanGoodsAdd',
                path: 'goods/add',
                component: () => import('@/views/salesman/goods/add'),
                meta: {
                    title: '商品管理-添加',
                    index: 'salesmanGoods',
                    // roleId: ['1', '4', '11'],
                    key: 'item',
                    perms: ['c']
                }
            },
            {
                name: 'salesmanGoodsEdit',
                path: 'goods/edit/:id',
                component: () => import('@/views/salesman/goods/edit'),
                meta: {
                    title: '商品管理-编辑',
                    index: 'salesmanGoods',
                    // roleId: ['1', '4', '11'],
                    key: 'item',
                    perms: ['u']
                }
            },
            {
                name: 'salesmanInventory',
                path: 'inventory/:id',
                component: () => import('@/views/salesman/inventory/list'),
                meta: {
                    title: '商品管理-库存',
                    index: 'salesmanGoods',
                    // roleId: ['1', '2', '3', '5', '4', '11'],
                    key: 'item',
                    perms: ['u']
                }
            },
            {
                name: 'salesmanCategory',
                path: 'category',
                component: () => import('@/views/salesman/category/list'),
                meta: {
                    title: '分类管理',
                    index: 'salesmanCategory',
                    // roleId: ['1', '2', '3', '5', '4', '11'],
                    key: 'item',
                    perms: ['l'],
                    isMenu: true
                }
            },
            {
                name: 'salesmanCategoryAdd',
                path: 'category/add',
                component: () => import('@/views/salesman/category/add'),
                meta: {
                    title: '分类管理-添加',
                    index: 'salesmanCategory',
                    // roleId: ['1', '4', '11'],
                    key: 'item',
                    perms: ['c']
                }
            },
            {
                name: 'salesmanCategoryEdit',
                path: 'category/edit/:id',
                component: () => import('@/views/salesman/category/edit'),
                meta: {
                    title: '分类管理-编辑',
                    index: 'salesmanCategory',
                    roleId: ['1', '4', '11'],
                    key: 'item',
                    perms: ['u']
                }
            },

            {
                name: 'salesmanBrand',
                path: 'brand',
                component: () => import('@/views/salesman/brand/list'),
                meta: {
                    title: '品牌管理',
                    key: 'brand',
                    perms: ['c'],
                    isMenu: true
                }
            },
            {
                name: 'salesmanBrandAdd',
                path: 'brand/add',
                component: () => import('@/views/salesman/brand/add'),
                meta: {
                    title: '品牌管理-添加',
                    index: 'salesmanBrand',
                    key: 'brand',
                    perms: ['c']
                }
            },
            {
                name: 'salesmanBrandEdit',
                path: 'brand/edit/:id',
                component: () => import('@/views/salesman/brand/edit'),
                meta: {
                    title: '品牌管理-编辑',
                    index: 'salesmanBrand',
                    key: 'brand',
                    perms: ['u']
                }
            },
            {
                name: 'SalesmanFirm',
                path: 'firm',
                component: () => import('@/views/salesman/firm/list'),
                meta: {
                    title: '厂商管理',
                    index: 'salesmanFirm',
                    key: 'item',
                    roleId: ['1', '4', '11'],
                    perms: ['l'],
                    isMenu: true
                }
            },
            {
                name: 'PostageTemplate',
                path: 'postage/template',
                component: () => import('@/views/salesman/postage/template'),
                meta: {
                    title: '运费模板',
                    key: 'item',
                    notGroup: true,
                    perms: ['l'],
                    isMenu: true
                }
            },
            {
                name: 'goodsList',
                path: 'comments/goodsList',
                component: () => import('@/views/salesman/comments/goodsList'),
                meta: {
                    title: '评价管理',
                    key: 'item',
                    notGroup: true,
                    perms: ['l'],
                    isMenu: true
                }
            },
            {
                name: 'commentList',
                path: 'comments/commentList/:itemId',
                component: () => import('@/views/salesman/comments/commentList'),
                meta: {
                    title: '编辑评价',
                    key: 'item',
                    notGroup: true,
                    perms: ['l'],
                }
            }
        ]
    }
];
