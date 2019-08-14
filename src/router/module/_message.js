export default  [{
    path: '/message', component: () => import('@/components/layout/MainContainer'),
    name: 'Message',
    meta: {
        name: '消息管理',
        isMenu: true,
        // roleId: ['1','4','6','10'],
        key:'msg',
        perms: ['l'],
    },
    children: [
        {
            name: 'messageManager',
            path: 'list',
            component: () => import('@/views/message/message'),
            meta: {
                title: '消息列表',
                index: 'messageManager',
                roleId: undefined,
                key:'msg',
                perms: ['l'],
                isMenu: true
            }
        }
    ]
}]
