export default [
    {
        name: 'StoreExpenseIncome',
        path: 'store/expense/income',
        component: () => import('@/views/store/expenseIncome'),
        meta: {
            title: '预存货款',
            roleId: ['1', '2', '3', '4', '5', '7', '8'],
            isMenu: true
        }
    }
];
