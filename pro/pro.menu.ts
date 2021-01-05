import {ProHomeMenuData} from "./packages/home/home.utils";

export const ProMenus: ProHomeMenuData[] = [
    {
        title: '页面一',
        path: 'nav-first-page',
        icon: 'el-icon-paperclip',
    },
    {
        title: '页面二',
        path: 'nav-second-page',
        icon: 'el-icon-share',
    },
    {
        title: '页面三',
        path: 'nav-third-page',
        icon: 'el-icon-s-ticket',
    },
    {
        title: "仪表盘",
        path: 'na1231412e',
        icon: 'el-icon-s-grid',
        children: [
            {title: '分析', path: 'dsad',},
            {title: '监控', path: 'ndsaczcge',},
            {title: '工作台', path: 'nsadage',},
        ],
    },
    {
        title: "表单页",
        path: 'n4353page',
        icon: 'el-icon-edit-outline',
        children: [
            {title: '基础表单', path: 'nw2131ge',},
            {title: '分布表单', path: 'nasacasge',},
            {title: '高级表单', path: 'ndsawr3',},
        ],
    },
    {
        title: "列表页",
        path: 'nfdfsage',
        icon: 'el-icon-list',
        children: [
            {
                title: '搜索列表', path: 'nsvdsa-page', children: [
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
        title: "详情页",
        path: 'njjtuytge',
        icon: 'el-icon-document',
        children: [
            {title: '基础详情页', path: 'tyutge',},
            {title: '高级详情页', path: 'nacsde',},
        ],
    },
    {
        title: "结果页",
        path: 'vdFe',
        icon: 'el-icon-check-bold',
        children: [
            {title: '成功', path: 'nEG6U356e',},
            {title: '失败', path: 'RSNYe',},
        ],
    },
    {
        title: "异常页",
        path: 'nav-first-page',
        icon: 'el-icon-close-bold',
        children: [
            {title: '权限不足（403）', path: 'nHYTKU7K6',},
            {title: '页面为空（404）', path: '43GER',},
            {title: '系统错误（500）', path: 'nAEFDge',},
        ],
    },
    {
        title: "个人页",
        path: 'naGREGW4e',
        icon: 'el-icon-s-tools',
        children: [
            {title: '个人设置', path: 'n654U5Je',},
            {title: '个人中心', path: 'nDSBFBe',},
        ],
    },
]