import Deposit from '@/router/module/block/_deposit';

export default [{
    path: '/deposit', component: () => import('@/components/layout/MainContainer'),
    name: 'Deposit',
    meta: {
        name: '预存款管理',
        key: ['deposit'],
        perms: ['l'],
        isMenu: true
    },
    children: [
        {
            path: 'fail', component: () => import('@/views/deposit/fail'),
            name: 'DepositFail',
            meta: {
                name: '返佣失败列表',
                key: ['deposit'],
                perms: ['l'],
                isMenu: true
            }
        },
        {
            path: 'review', component: () => import('@/views/deposit/review'),
            name: 'DepositReview',
            meta: {
                name: '批复预存款',
                key: ['deposit'],
                perms: ['c'],
                isMenu: true
            }
        },
        {
            path: 'detail', component: () => import('@/views/deposit/detail'),
            name: 'DepositDetail',
            meta: {
                name: '预存款明细',
                key: ['deposit'],
                perms: ['l'],
                isMenu: true
            }
        },
        {
            path: 'detail/info/:id', component: () => import('@/views/deposit/detailInfo'),
            name: 'DepositDetailInfo',
            meta: {
                name: '预存款明细',
                key: ['deposit'],
                perms: ['l'],
                isMenu: false
            }
        },
        ...Deposit
    ]
}];
