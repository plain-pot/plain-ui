interface Menu {
    name: string,
    title: string,
    page: string,
    complete?: boolean,
}

interface MenuGroup {
    name: string,
    children: Menu[],
}

export const MENUS: MenuGroup[] = [
    {
        name: '基础', children: [
            {name: 'Color', title: '颜色', page: '/normal/color', complete: false},
            {name: 'Icon', title: '图标', page: '/normal/icon', complete: false},
            {name: 'Button', title: '按钮', page: '/normal/button', complete: false},
            {name: 'Grid', title: '栅格', page: '/normal/grid', complete: false},
        ]
    },
    {
        name: '表单元素', children: [
            {name: 'Input', title: '输入框', page: '/normal/input', complete: false},
            {name: 'Radio', title: '单选框', page: '/normal/radio', complete: false},
            {name: 'Checkbox', title: '复选框', page: '/normal/checkbox', complete: false},
            {name: 'Number', title: '数字输入', page: '/normal/number', complete: false},
            {name: 'Loading', title: '加载', page: '/normal/loading', complete: false},
            {name: 'Select', title: '下拉选择', page: '/normal/select', complete: false},
            {name: 'Toggle', title: '开关切换', page: '/normal/toggle', complete: false},
            {name: 'Slider', title: '滑块', page: '/normal/slider', complete: false},
            {name: 'Tag', title: '标签', page: '/normal/tag', complete: false},
            {name: 'Rate', title: '评分', page: '/normal/rate', complete: false},
            {name: 'ColorPicker', title: '颜色选择', page: '/normal/color-picker', complete: false},

            {name: 'Cascade', title: '级联选择', page: '/normal/cascade', complete: false},
            {name: 'Time', title: '时间选择', page: '/normal/time', complete: false},
            {name: 'Date', title: '日期选择', page: '/normal/date', complete: false},
            {name: 'Upload', title: '文件上传', page: '/normal/upload', complete: false},
            {name: 'Img', title: '图片上传', page: '/normal/img', complete: false},
        ]
    },
    {
        name: '表单示例', children: [
            {name: 'Form', title: '表单基础', page: '/form/form', complete: false},
            {name: 'Form', title: '表单多列', page: '/form/form-multi-column', complete: false},
            {name: 'Form', title: '表单尺寸', page: '/form/form-size', complete: false},
            {name: 'Form', title: '表单控制', page: '/form/form-edit-control', complete: false},
            {name: 'Form', title: '表单校验', page: '/form/form-validate', complete: false},
            {name: 'Form', title: '校验blur', page: '/form/form-blur', complete: false},
            {name: 'Form', title: '表单组件', page: '/form/form-elements', complete: false},
            {name: 'Form', title: '校验模式', page: '/form/form-validate-mode', complete: false},
            {name: 'Form', title: '动态表单项', page: '/form/form-dynamic-items', complete: false},
        ]
    },
    {
        name: '视图', children: [
            {name: 'List', title: '列表', page: '/normal/list', complete: false},
            {name: 'VirtualList', title: '虚拟列表', page: '/normal/virtual-list', complete: false},
            {name: 'Progress', title: '进度条', page: '/normal/progress', complete: false},
            {name: 'Tree', title: '树形组件', page: '/normal/tree', complete: false},
            {name: 'Virtual Tree', title: '虚拟树', page: '/normal/virtual-tree', complete: false},
            {name: 'Pagination', title: '分页', page: '/normal/pagination', complete: false},
            {name: 'Badge', title: '标记', page: '/normal/badge', complete: false},
            {name: 'Step', title: '步骤条', page: '/normal/step', complete: false},
            {name: 'Tab', title: '页签', page: '/normal/tab', complete: false},
        ]
    },
    {
        name: '导航', children: [
            {name: 'NavTab', title: '页签导航', page: '/nav/nav-tab', complete: false},
            {name: 'NavPages', title: '页面导航', page: '/nav/nav-page', complete: false},
            {name: 'Nav', title: '应用导航', page: '/nav/nav', complete: false},
        ]
    },
    {
        name: '其他', children: [
            {name: 'Scroll', title: '滚动条', page: '/normal/scroll', complete: false},
            {name: 'Dialog', title: '对话框', page: '/normal/dialog', complete: false},
            {name: 'Tooltip', title: '文字提示', page: '/normal/tooltip', complete: false},
            {name: 'Dropdown', title: '悬浮层', page: '/normal/dropdown', complete: false},
            {name: 'Popover', title: '弹出框', page: '/normal/popover', complete: false},
            {name: 'Popper', title: '悬浮框', page: '/normal/popper', complete: false},
            {name: 'Card', title: '卡片', page: '/normal/card', complete: false},
            {name: 'Carousel', title: '轮播', page: '/normal/carousel', complete: false},
            {name: 'Collapse', title: '折叠面板', page: '/normal/collapse', complete: false},
            {name: 'Alert', title: '提示信息', page: '/normal/alert', complete: false},
            {name: 'Portal', title: '迁移DOM元素', page: '/normal/portal', complete: false},
            {name: 'Triangle', title: '三角形元素', page: '/normal/triangle', complete: false},
            {name: 'FilletCorner', title: '圆角', page: '/normal/fillet-corner', complete: false},
            {name: 'TabHeader', title: '页签头组件', page: '/normal/tab-header', complete: false},
        ]
    },
    {
        name: '服务', children: [
            {name: '$message', title: '消息服务', page: '/service/message-service', complete: false},
            {name: '$select', title: '选择服务', page: '/service/select-service', complete: false},
            {name: '$dialog', title: '对话框服务', page: '/service/dialog-service', complete: false},
            {name: '$notice', title: '通知', page: '/service/notice-service', complete: false},
            {name: '$file', title: '文件服务', page: '/service/file', complete: false},
        ]
    },
    {
        name: '表格', children: [
            {name: 'Virtual', title: 'pl-virtual-table', page: '/table/virtual-table', complete: false},
            {name: 'Basic', title: '基础表格', page: '/table/table-basic', complete: false},
            {name: 'Test', title: '基础测试', page: '/table/table-base-test', complete: false},
            {name: 'Config', title: '自定义配置', page: '/table/table-config', complete: false},
            {name: 'Fixed', title: '固定列', page: '/table/table-fixed', complete: false},
            {name: 'ScopedSlot', title: '列作用域插槽', page: '/table/table-plc-scoped-slot', complete: false},

            {name: 'Dynamic Control', title: '列动态控制', page: '/table/table-plc-editable', complete: false},
            {name: 'Plc', title: '列组件', page: '/table/table-columns', complete: false},
            {name: 'Expand', title: '展开列', page: '/table/table-expand', complete: false},
            {name: 'Span', title: '合并单元格', page: '/table/span/table-span', complete: false},
            {name: 'Tree', title: '树形表格', page: '/table/tree/table-tree', complete: false},
            {name: 'Row Draggable', title: '行拖拽排序', page: '/table/table-row-draggable', complete: false},
            {name: 'Col Draggable', title: '列拖拽排序', page: '/table/table-col-draggable', complete: false},
            {name: 'Table class-style', title: '行列样式', page: '/table/table-class-style', complete: false},
        ]
    },
    {
        name: 'Sticky Table',
        children: [
            {name: 'Sticky Table', title: '另一种形式的表格', page: '/sticky-table/demo-sticky-table', complete: false},
            {name: 'Sticky', title: '粘粘组件', page: '/sticky-table/demo-sticky', complete: false},
        ]
    },
    {
        name: '测试', children: [
            {name: 'Test', title: '测试手动渲染实例', page: '/normal/test', complete: false},
            {name: 'Drag', title: '测试拖拽节点', page: '/test/test-drag', complete: false},
            {name: 'Svg', title: '测试svg', page: '/test/test-svg', complete: false},
            {name: 'Canvas', title: '测试canvas', page: '/test/test-canvas', complete: false},
            {name: 'High', title: '测试高阶组件', page: '/test/test-high', complete: false},
            {name: 'Listener', title: '测试事件', page: '/test/test-listener', complete: false},
            {name: 'Filter', title: '异步过滤器', page: '/test/test-filter', complete: false},
            {name: 'List Draggier', title: '列表拖拽排序', page: '/test/test-list-draggier', complete: false},
        ]
    },
]