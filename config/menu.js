let nav = [
    // 系统
    {
        name: 'system',
        parentId: 0,
        id: 1,
        meta: {
            icon: 'dashboard',
            title: '系统设置',
            show: true
        },
        component: 'RouteView',
        redirect: '/system/advert'
    },
    /*
    {
        name: 'advert',
        parentId: 1,
        id: 2,
        meta: {
            title: '广告设置',
            show: true
        },
        path: '/system/advert/:pageNo([1-9]\\d*)?',
        component: 'Advert'
    },
    {
        name: 'announcement',
        parentId: 1,
        id: 3,
        meta: {
            title: '公告管理',
            show: true
        },
        path: '/system/announcement/:pageNo([1-9]\\d*)?',
        component: 'Announcement'
    },
    {
        name: 'Promote',
        parentId: 1,
        id: 4,
        meta: {
            title: '推广管理',
            show: true
        },
        path: '/system/promote/:pageNo([1-9]\\d*)?',
        component: 'Promote'
    },
    {
        name: 'exch-group',
        parentId: 1,
        id: 5,
        meta: {
            title: '交流群',
            show: true
        },
        path: '/system/exch-group',
        component: 'ExchGroup'
    },

    {
        name: 'common-problem',
        parentId: 1,
        id: 6,
        meta: {
            title: '常见问题',
            show: true
        },
        component: 'CommonProblem',
        path: '/system/common-problem'
    },
    {
        name: 'about-us',
        parentId: 1,
        id: 7,
        meta: {
            title: '关于我们',
            show: true
        },
        component: 'AboutUs',
        path: '/system/about-us'
    },
     */
    {
        name: 'role',
        parentId: 1,
        id: 8,
        meta: {
            title: '角色管理',
            show: true
        },
        component: 'Role',
        path: '/system/role/:pageNo([1-9]\\d*)?'
    },
    {
        name: 'user',
        parentId: 1,
        id: 9,
        meta: {
            title: '后台用户',
            show: true
        },
        component: 'User',
        path: '/system/user/:pageNo([1-9]\\d*)?'
    },
    // 分类管理
    {
        name: 'category',
        parentId: 0,
        id: 20,
        meta: {
            icon: 'dashboard',
            title: '分类管理',
            show: true
        },
        component: 'RouteView',
        redirect: '/category/list'
    },
    {
        name: 'home-clist',
        parentId: 20,
        id: 21,
        meta: {
            title: '首页分类列表',
            show: true
        },
        path: '/category/home-clist',
        component: 'HomeClist'
    },
    {
        name: 'member-clist',
        parentId: 20,
        id: 22,
        meta: {
            title: '会员页分类列表',
            show: true
        },
        path: '/category/member-clist',
        component: 'MemberClist'
    },
    // 分区管理
    {
        name: 'section',
        parentId: 0,
        id: 40,
        meta: {
            icon: 'plus-square',
            title: '分区管理',
            show: true
        },
        component: 'RouteView',
        redirect: '/section/slist'
    },
    {
        name: 'section-list',
        parentId: 40,
        id: 41,
        meta: {
            title: '分区列表',
            show: true
        },
        path: '/section/slist',
        component: 'Slist'
    },
    // 视频管理
    {
        name: 'video',
        parentId: 0,
        id: 60,
        meta: {
            icon: 'dashboard',
            title: '视频管理',
            show: true
        },
        component: 'RouteView',
        redirect: '/video/vlist'
    },
    {
        name: 'video-list',
        parentId: 60,
        id: 61,
        meta: {
            title: '视频列表',
            show: true
        },
        path: '/video/vlist',
        component: 'Vlist'
    },
    {   // 表单管理
        name: 'video-form',
        parentId: 0,
        id: 100,
        meta: {
            icon: 'dashboard',
            title: '表单管理',
            show: true
        },
        component: 'RouteView',
        redirect: '/videoform/flist'
    },
    {
        name: 'video-form-list',
        parentId: 100,
        id: 101,
        meta: {
            title: '视频表单',
            show: true
        },
        path: '/videoform/flist',
        component: 'Flist'
    },
    // 用户管理
    {
        name: 'member',
        parentId: 0,
        id: 80,
        meta: {
            icon: 'dashboard',
            title: '用户管理',
            show: true
        },
        component: 'RouteView',
        redirect: '/member/mlist'
    },
    {
        name: 'member-list',
        parentId: 80,
        id: 81,
        meta: {
            title: '用户列表',
            show: true
        },
        path: '/member/mlist',
        component: 'Mlist'
    },
    {
        name: 'data-statistics',
        parentId: 0,
        id: 120,
        meta: {
            icon: 'dashboard',
            title: '数据统计',
            show: true
        },
        component: 'RouteView',
        redirect: '/statistics/total-table'
    },
    {
        name: 'statistics-total-table',
        parentId: 120,
        id: 121,
        meta: {
            title: '数据总表',
            show: true
        },
        path: '/statistics/total-table',
        component: 'TotalTable'
    },
    {
        name: 'statistics-remain',
        parentId: 120,
        id: 122,
        meta: {
            title: '留存分析',
            show: true
        },
        path: '/statistics/remain',
        component: 'Remain'
    }
]

module.exports = nav;
