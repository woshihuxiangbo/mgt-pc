export default [
    {
        name: 'GroupItemCategory',
        path: 'item/category/list',
        component: () => import('@/views/salesman/group/category/list'),
        meta: {
            title: '商品分类',
            key: 'item',
            perms: ['l'],
            isMenu: true,
        }
    },
    {
        name: 'GroupItemCategoryAdd',
        path: 'item/category/add',
        component: () => import('@/views/salesman/group/category/add'),
        meta: {
            title: '添加商品分类',
            key: 'item',
            perms: ['c'],
            isMenu: false,
        }
    },
    {
        name: 'GroupItemCategoryEdit',
        path: 'item/category/edit/:id',
        component: () => import('@/views/salesman/group/category/edit'),
        meta: {
            title: '修改商品分类',
            key: 'item',
            perms: ['u'],
            isMenu: false,
        }
    }
]
