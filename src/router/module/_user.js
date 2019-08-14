/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:15:31
 * @LastEditTime: 2019-08-12 14:38:35
 * @LastEditors: Please set LastEditors
 */
export default [
    {
        path: '/user', component: () => import('@/components/layout/MainContainer'),
        name: 'User',
        meta: {
            isMenu: true,
            // roleId: ['1', '2', '3', '4', '5'],
            name: '用户管理',
            key: 'user',
            perms: ['r']
        },
        children: [
            {
                path: 'list',
                name: 'UserList',
                component: () => import('@/views/user/list'),
                meta: {
                    title: '用户列表',
                    index: 'userList',
                    // roleId: ['1', '2', '3', '4', '5'],
                    key: 'user',
                    isMenu: true,
                    perms: ['r']
                }
            },
            {
                path: 'edit/:id',
                name: 'UserEdit',
                component: () => import('@/views/user/edit'),
                meta: {
                    title: '编辑用户',
                    index: 'userList',
                    // roleId: ['1', '2', '3', '4', '5'],
                    key: 'user',
                    perms: ['u']
                }
            },
            {
                path: 'relation',
                name: 'RelationList',
                component: () => import('@/views/user/relation'),
                meta: {
                    title: '团队关系',
                    index: 'userList',
                    roleId: undefined,
                    key: 'user',
                    perms: ['r']
                }
            },
            // {
            //     path: 'team/list',
            //     name: 'UserTeamList',
            //     component: () => import('@/views/user/team/list'),
            //     meta: {
            //         title: '团队关系',
            //         // roleId: ['1', '2', '3', '4', '5'],
            //         key: 'user',
            //         isMenu: true,
            //         perms: ['r']
            //     }
            // },
            // 返佣明细
            {
                path: 'returnMoney',
                name: 'returnMoney',
                component: () => import('@/views/user/returnMoney'),
                meta: {
                    title: '返佣明细',
                    // roleId: ['1', '2', '3', '4', '5'],
                    // isMenu: true,
                    key: 'user',
                }
            }
        ]
    }
]
