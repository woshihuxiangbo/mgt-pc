export default [
    {
        path: 'recharge',
        component: () => import('@/views/deposit/recharge'),
        name: 'DepositRecharge',
        meta: {
            name: '经销商充值预存款',
            roleId: ['1', '4'],
            key: ['deposit'],
            perms: ['l'],
            isMenu: true
        }
    },
    {
        path: 'review/recharge',
        component: () => import('@/views/deposit/reviewRecharge'),
        name: 'DepositReviewRecharge',
        meta: {
            name: '审核经销商预存款',
            roleId: ['1', '2', '3', '4', '7'],
            isMenu: true
        }
    }
];
