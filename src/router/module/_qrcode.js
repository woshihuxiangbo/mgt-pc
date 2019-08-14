export default [{
    path: '/qr/code', component: () => import('@/components/layout/MainContainer'),
    name: 'Qrcode',
    meta: {
        name: '防伪码',
        roleId: ['11'],
        key: 'securityCode',
        perms: ['l'],
        isMenu: true
    },
    children: [
        {
            path: 'create',
            name: 'QrcodeCreate',
            component: () => import('@/views/system/qrcode'),
            meta: {
                title: '生成防伪码',
                roleId: [ '11'],
                key: 'securityCode',
                perms: ['c'],
                isMenu: true
            }
        },
        {
            path: 'computed',
            name: 'ComputedQrcode',
            component: () => import('@/views/system/compQrcode'),
            meta: {
                title: '防伪码列表',
                roleId: [ '11'],
                key: 'securityCode',
                perms: ['l'],
                isMenu: true
            }
        }
    ]
}];