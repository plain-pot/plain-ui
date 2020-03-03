export default [
    {
        name: '基础', children: [
            {name: 'Color', title: '颜色', icon: 'r-color', page: '/normal/color', complete: true},
            {name: 'Icon', title: '图标', icon: 'pad-font-colors', page: '/normal/icon', complete: true},
            {name: 'Button', title: '按钮', icon: 'pad-play-circle', page: '/normal/button', complete: true},
            {name: 'Grid', title: '栅格', icon: 'pad-play-circle', page: '/normal/grid', complete: true},
            {name: 'Container', title: '容器', icon: 'pad-play-circle', page: '/normal/container', complete: true},
        ]
    },
    {
        name: '表单', children: [
            {name: 'Input', title: '输入框', icon: 'r-edit-square-light', page: '/normal/input', complete: true},
            {name: 'Textarea', title: '文本域', icon: 'r-textarea', page: '/normal/textarea', complete: true},
            {name: 'Radio', title: '单选框', icon: 'r-circle-radio', page: '/normal/radio', complete: true},
            {name: 'Checkbox', title: '复选框', icon: 'r-circle-radio', page: '/normal/checkbox', complete: true},
            {name: 'InputNumber', title: '数字输入', icon: 'r-number', page: '/normal/number', complete: true},
            {name: 'Loading', title: '加载', icon: 'r-loading-section-three', page: '/normal/loading', complete: true},
            {name: 'Select', title: '下拉选择', icon: 'pad-down', page: '/normal/select', complete: true},
            {name: 'Cascade', title: '级联选择', icon: 'pad-doubledown', page: '/normal/cascade', complete: true},
            {name: 'Toggle', title: '开关切换', icon: 'r-toggle', page: '/normal/toggle', complete: true},
            {name: 'Slider', title: '滑块', icon: 'r-slider', page: '/normal/slider', complete: true},
            {name: 'Timer', title: '时间选择', icon: 'r-time-circle-light', page: '/normal/time', complete: true},
            {name: 'Date', title: '日期选择', icon: 'r-date-fill', page: '/normal/date', complete: true},
            {name: 'Rate', title: '评分', icon: 'pad-star', page: '/normal/rate', complete: true},
            {name: 'ColorPicker', title: '颜色选择', icon: 'r-color', page: '/normal/color-picker', complete: true},
            {name: 'Upload', title: '文件上传', icon: 'pad-file', page: '/normal/upload', complete: true},
            {name: 'Img', title: '图片上传', icon: 'pad-image', page: '/normal/img', complete: true},
            {name: 'Form', title: '表单', icon: 'r-form', page: '/normal/form', complete: true},
        ]
    },
    {
        name: '视图', children: [
            {name: 'List', title: '列表', icon: 'r-list', page: '/normal/list', complete: true},
            {name: 'Tag', title: '标签', icon: 'r-icon-tag', page: '/normal/tag', complete: true},
            {name: 'Progress', title: '进度条', icon: 'r-progress', page: '/normal/progress', complete: true},
            {name: 'Tree', title: '树形组件', icon: 'r-tree', page: '/normal/tree', complete: true},
            {name: 'Pagination', title: '分页', icon: 'r-book2', page: '/normal/pagination', complete: true},
            {name: 'Badge', title: '标记', icon: 'r-badge', page: '/normal/badge', complete: true},
            {name: 'ScrollOption', title: '滚动选择', icon: 'icon-scroll', page: '/normal/scroll-option', complete: true},
            {name: 'Step', title: '步骤条', icon: 'r-step', page: '/normal/step', complete: true},
            {name: 'Transform', title: '穿梭框', icon: 'r-exchange', page: '/normal/icon', complete: false},
        ]
    },
    {
        name: '导航', children: [
            {name: 'Tabs', title: '页签', icon: 'r-tabs', page: '/normal/tabs', complete: true},
            {name: 'TabsHeader', title: '页签标题', icon: 'r-tabs', page: '/normal/tab-header', complete: true},
            {name: 'NavTab', title: '页签导航', icon: 'r-tabs', page: '/nav/nav-tab', complete: true},
            {name: 'NavPages', title: '页面导航', icon: 'r-page', page: '/nav/nav-page', complete: true},
            {name: 'Nav', title: '应用导航', icon: 'r-tabs', page: '/nav/nav', complete: true},
        ]
    },
    {
        name: '其他', children: [
            {name: 'Scroll', title: '滚动条', icon: 'icon-scroll', page: '/normal/scroll', complete: true},
            {name: 'Dialog', title: '对话框', icon: 'r-window', page: '/normal/dialog', complete: true},
            {name: 'Tooltip', title: '文字提示', icon: 'r-tooltip', page: '/normal/tooltip', complete: true},
            {name: 'Dropdown', title: '悬浮层', icon: 'r-popper', page: '/normal/dropdown', complete: true},
            {name: 'Popover', title: '弹出框', icon: 'r-popper', page: '/normal/popover', complete: true},
            {name: 'Popper', title: '悬浮框', icon: 'r-popper', page: '/normal/popper', complete: true},
            {name: 'Card', title: '卡片', icon: 'r-card', page: '/normal/card', complete: true},
            {name: 'Carousel', title: '轮播', icon: 'r-carousel', page: '/normal/carousel', complete: true},
            {name: 'Collapse', title: '折叠面板', icon: 'r-collapse', page: '/normal/collapse', complete: true},
            {name: 'Dom', title: '迁移DOM元素', icon: 'icon-scroll', page: '/directive/plain-dom', complete: true},
        ]
    },
    {
        name: '服务', children: [
            {name: '$message', title: '消息服务', icon: 'pad-message', page: '/normal/message', complete: true},
            {name: '$select', title: '选择服务', icon: 'pad-message', page: '/service/select-service', complete: true},
            {name: '$dialog', title: '对话框服务', icon: 'r-window', page: '/service/dialog-service', complete: true},
            {name: '$notice', title: '通知', icon: 'pad-bell', page: '/service/notice-service', complete: true},
            {name: '$file', title: '文件服务', icon: 'pad-bell', page: '/service/file', complete: true},
        ]
    },
    {
        name: '表格', children: [
            {name: 'Table Basic', title: '基础表格', icon: 'r-table-solid', page: '/table/base-table', complete: true},
            {name: 'Table Fixed Column', title: '固定列', icon: 'r-table-solid', page: '/table/base-table-fixed', complete: true},
            {name: 'Table Fill', title: '宽高填满父元素', icon: 'r-table-solid', page: '/table/base-table-fit-parent', complete: true},
            {name: 'Table Basic Props', title: '基本属性', icon: 'r-table-solid', page: '/table/base-table-props', complete: true},
            {name: 'Table Edit', title: '基本编辑', icon: 'r-table-solid', page: '/table/base-table-edit', complete: true},
            {name: 'Table Column Props', title: '列属性', icon: 'r-table-solid', page: '/table/base-table-column-prop', complete: true},
            {name: 'Table Dynamic Control', title: '列动态控制', icon: 'r-table-solid', page: '/table/base-table-dynamic', complete: true},
            {name: 'Table Column Slots', title: '列插槽', icon: 'r-table-solid', page: '/table/base-table-slot', complete: true},
            {name: 'Table Tooltip', title: '列显示', icon: 'r-table-solid', page: '/table/base-table-tooltip', complete: true},
            {name: 'Table Columns', title: '列组件', icon: 'r-table-solid', page: '/table/base-table-column', complete: true},
            {name: 'Table Methods', title: '方法', icon: 'r-table-solid', page: '/table/base-table-methods', complete: true},
        ]
    },
    {name: '指令'},
    {
        name: '其他', children: [
            {name: 'Test', title: '测试手动渲染实例', icon: 'r-table-solid', page: '/normal/render-func', complete: true},
        ]
    },
]