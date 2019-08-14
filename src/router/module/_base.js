export default [{
        path: '/sign',
        name: 'sign',
        meta: {
            title: '登录'
        },
        component: () => import('@/views/base/sign')
    },
    {
        path: '/',
        name: 'Index',
        redirect:{
        	name:'sign'
        }
    },
    {
        path: '*',
        redirect:{
        	name:'404'
        }
    }
]
