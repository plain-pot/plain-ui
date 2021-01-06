export type ProHomeMenuData = {
    title: string,
    path?: string,
    icon?: string,
    data?: any,
    children?: ProHomeMenuData[],
    expand?: boolean,
}

export const ProMenus: ProHomeMenuData[] = [
    // {title: '产品行', path: 'prod/prod-series', icon: 'el-icon-tools',},
    {
        title: '产品（主应用子模块）',
        icon: 'el-icon-tools',
        children: [
            {title: '产品系列', path: 'prod/prod-series'},
            {title: '产品层次', path: 'prod/prod-levels'},
            {title: '产品分类', path: 'prod/prod-category'},
        ],
    },
    {
        title: '订单（主应用子模块）',
        icon: 'el-icon-tools',
        children: [
            {title: '订单系列', path: 'order/order-series'},
            {title: '订单层次', path: 'order/order-levels'},
            {title: '订单分类', path: 'order/order-category'},
        ],
    },
    {
        title: 'Vue页面(子应用)',
        icon: 'el-icon-tools',
        children: [
            {title: 'Vue页面一', path: 'sub-vue/vue-page-1'},
            {title: 'Vue页面二', path: 'sub-vue/vue-page-2'},
            {title: 'Vue页面三', path: 'sub-vue/vue-page-3'},
        ],
    },
    {
        title: '测试导航组件',
        icon: 'el-icon-folder',
        children: [
            {
                title: '页面一',
                path: 'pro/nav/nav-first-page',
                icon: 'el-icon-paperclip',
            },
            {
                title: '页面二',
                path: 'pro/nav/nav-second-page',
                icon: 'el-icon-share',
            },
            {
                title: '页面三',
                path: 'pro/nav/nav-third-page',
                icon: 'el-icon-delete-location',
            },
        ],
    },
    {
        title: "系统仪表盘",
        icon: 'el-icon-s-grid',
        children: [
            {title: '分析', path: 'dsad',},
            {title: '监控', path: 'ndsaczcge',},
            {title: '工作台', path: 'nsadage',},
        ],
    },
    {
        title: "表单页示例",
        icon: 'el-icon-edit-outline',
        children: [
            {title: '基础表单', path: 'nw2131ge',},
            {title: '分布表单', path: 'nasacasge',},
            {title: '高级表单', path: 'ndsawr3',},
        ],
    },
    {
        title: "列表页示例",
        icon: 'el-icon-list',
        children: [
            {
                title: '搜索列表', children: [
                    {title: '搜索文章', path: 'rhrt'},
                    {title: '搜索项目', path: 'rewre'},
                    {title: '搜索应用', path: 'sadsad'},
                ]
            },
            {title: '查询表格', path: 'yujytjge',},
            {title: '标准列表', path: 'hdgdfe',},
            {title: '卡片列表', path: '563453e',},
        ],
    },
    {
        title: "详情页示例",
        icon: 'el-icon-document',
        children: [
            {title: '基础详情页', path: 'tyutge',},
            {title: '高级详情页', path: 'nacsde',},
        ],
    },
    {
        title: "结果页示例",
        icon: 'el-icon-check-bold',
        children: [
            {title: '成功', path: 'nEG6U356e',},
            {title: '失败', path: 'RSNYe',},
        ],
    },
    {
        title: "异常页示例",
        icon: 'el-icon-close-bold',
        children: [
            {title: '权限不足（403）', path: 'nHYTKU7K6',},
            {title: '页面为空（404）', path: '43GER',},
            {title: '系统错误（500）', path: 'nAEFDge',},
        ],
    },
    {
        title: "个人页示例",
        icon: 'el-icon-s-tools',
        children: [
            {title: '个人设置', path: 'n654U5Je',},
            {title: '个人中心', path: 'nDSBFBe',},
        ],
    },
]