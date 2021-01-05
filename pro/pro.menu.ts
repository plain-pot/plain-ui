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
        path: 'nav-first-page',
        icon: 'el-icon-s-grid',
        children: [
            {title: '分析', path: 'nav-first-page',},
            {title: '监控', path: 'nav-first-page',},
            {title: '工作台', path: 'nav-first-page',},
        ],
    },
    {
        title: "表单页",
        path: 'nav-first-page',
        icon: 'el-icon-edit-outline',
        children: [
            {title: '基础表单', path: 'nav-first-page',},
            {title: '分布表单', path: 'nav-first-page',},
            {title: '高级表单', path: 'nav-first-page',},
        ],
    },
    {
        title: "列表页",
        path: 'nav-first-page',
        icon: 'el-icon-list',
        children: [
            {
                title: '搜索列表', path: 'nav-first-page', children: [
                    {title: '搜索文章', path: ''},
                    {title: '搜索项目', path: ''},
                    {title: '搜索应用', path: ''},
                ]
            },
            {title: '查询表格', path: 'nav-first-page',},
            {title: '标准列表', path: 'nav-first-page',},
            {title: '卡片列表', path: 'nav-first-page',},
        ],
    },
    {
        title: "详情页",
        path: 'nav-first-page',
        icon: 'el-icon-document',
        children: [
            {title: '基础详情页', path: 'nav-first-page',},
            {title: '高级详情页', path: 'nav-first-page',},
        ],
    },
    {
        title: "结果页",
        path: 'nav-first-page',
        icon: 'el-icon-check-bold',
        children: [
            {title: '成功', path: 'nav-first-page',},
            {title: '失败', path: 'nav-first-page',},
        ],
    },
    {
        title: "异常页",
        path: 'nav-first-page',
        icon: 'el-icon-close-bold',
        children: [
            {title: '权限不足（403）', path: 'nav-first-page',},
            {title: '页面为空（404）', path: 'nav-first-page',},
            {title: '系统错误（500）', path: 'nav-first-page',},
        ],
    },
    {
        title: "个人页",
        path: 'nav-first-page',
        icon: 'el-icon-s-tools',
        children: [
            {title: '个人设置', path: 'nav-first-page',},
            {title: '个人中心', path: 'nav-first-page',},
        ],
    },
]