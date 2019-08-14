export default [{
    path: '/article', component: () => import('@/components/layout/MainContainer'),
    name: 'Article',
    meta: {
        name: '内容管理',
        // roleId: ['1', '2', '3', '4', '5'],
        isMenu: true,
        key: ['content', 'contentClass'],
        perms: ['l']
    },
    children: [
        {
            path: 'category/list',
            name: 'ArticleCategoryList',
            component: () => import('@/views/article/category/list'),
            meta: {
                title: '栏目管理',
                index: 'articleCategoryList',
                // roleId: ['1', '2', '3', '4', '5'],
                key: 'contentClass',
                perms: ['l'],
                isMenu: true
            }
        },
        {
            path: 'category/create',
            name: 'ArticleCategoryCreate',
            component: () => import('@/views/article/category/create'),
            meta: {
                title: '添加栏目',
                index: 'articleCategoryList',
                // roleId: ['4'],
                key: 'contentClass',
                perms: ['c']
            }
        },
        {
            path: 'category/create/:id',
            name: 'ArticleCategoryEdit',
            component: () => import('@/views/article/category/edit'),
            meta: {
                title: '编辑分类',
                index: 'articleCategoryList',
                // roleId: ['4'],
                key: 'contentClass',
                perms: ['u']
            }
        },
        {
            path: 'add',
            name: 'ArticleAdd',
            component: () => import('@/views/article/create'),
            meta: {
                title: '添加内容',
                index: 'articleList',
                // roleId: ['1', '4'],
                key: 'content',
                perms: ['c']
                // isMenu: true
            }
        },
        {
            path: 'list',
            name: 'ArticleList',
            component: () => import('@/views/article/list'),
            meta: {
                title: '内容管理',
                index: 'articleList',
                // roleId: ['1', '2', '3', '4', '5'],
                key: 'content',
                perms: ['l'],
                isMenu: true
            }
        },
        {
            path: 'edit/:id',
            name: 'ArticleEdit',
            component: () => import('@/views/article/edit'),
            meta: {
                title: '内容编辑',
                index: 'articleList',
                // roleId: ['1', '4'],
                key: 'content',
                perms: ['u']
            }
        },
        //  权益管理
        {
            path: 'rights/list',
            name: 'rightsManagement',
            component: () => import('@/views/article/rightsManagement/list'),
            meta: {
                title: '权益管理',
                key: 'content',
                perms: ['l'],
                isMenu: true
            }
        },
        {
            path: 'rights/create',
            name: 'rightsManagementCreate',
            component: () => import('@/views/article/rightsManagement/create'),
            meta: {
                title: '添加权益',
                perms: ['c'],
                key: 'content',
            }
        },
        {
            path: 'rights/edit',
            name: 'rightsManagementEdit',
            component: () => import('@/views/article/rightsManagement/edit'),
            meta: {
                title: '权益编辑',
                perms: ['u'],
                key: 'content',
            }
        }
    ]
}];
