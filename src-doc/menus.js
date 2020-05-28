export default [
    {name: '简介'},
    {name: '快速上手'},
    {
        name: '基础', children: [
            // {name: 'Color', title: '颜色', icon: 'pl-color', page: '/normal/color', complete: false},
            {name: 'Icon', title: '图标', icon: 'pad-font-colors', page: '/normal/icon', complete: true},
            {name: 'Button', title: '按钮', icon: 'pad-play-circle', page: '/normal/button', complete: true},
            {name: 'Grid', title: '栅格', icon: 'pad-play-circle', page: '/normal/grid', complete: true},
            // {name: 'Container', title: '容器', icon: 'pad-play-circle', page: '/normal/container', complete: false},
        ]
    },
    {
        name: '表单元素', children: [
            {name: 'Input', title: '输入框', icon: 'pl-edit-square-light', page: '/normal/input', complete: true},
            // {name: 'Textarea', title: '文本域', icon: 'pl-textarea', page: '/normal/textarea', complete: false},
            {name: 'Radio', title: '单选框', icon: 'pl-circle-radio', page: '/normal/radio', complete: true},
            {name: 'Checkbox', title: '复选框', icon: 'pl-circle-radio', page: '/normal/checkbox', complete: true},
            {name: 'Number', title: '数字输入', icon: 'pl-number', page: '/normal/number', complete: true},
            {name: 'Loading', title: '加载', icon: 'pl-loading-section-three', page: '/normal/loading', complete: true},
            {name: 'Select', title: '下拉选择', icon: 'pad-down', page: '/normal/select', complete: false},
            {name: 'Toggle', title: '开关切换', icon: 'pl-toggle', page: '/normal/toggle', complete: true},
            {name: 'Slider', title: '滑块', icon: 'pl-slider', page: '/normal/slider', complete: true},
            {name: 'Tag', title: '标签', icon: 'pl-icon-tag', page: '/normal/tag', complete: true},
            {name: 'Rate', title: '评分', icon: 'pad-star', page: '/normal/rate', complete: true},
            {name: 'ColorPicker', title: '颜色选择', icon: 'pl-color', page: '/normal/color-picker', complete: true},

            {name: 'Cascade', title: '级联选择', icon: 'pad-doubledown', page: '/normal/cascade', complete: false},
            {name: 'Time', title: '时间选择', icon: 'pl-time-circle-light', page: '/normal/time', complete: false},
            {name: 'Date', title: '日期选择', icon: 'pl-date-fill', page: '/normal/date', complete: false},
            {name: 'Upload', title: '文件上传', icon: 'pad-file', page: '/normal/upload', complete: false},
            {name: 'Img', title: '图片上传', icon: 'pad-image', page: '/normal/img', complete: false},
        ]
    },
    {
        name: '表单示例', children: [
            {name: 'Form', title: '表单基础', icon: 'pl-form', page: '/form/form', complete: false},
            {name: 'Form', title: '表单多列', icon: 'pl-form', page: '/form/form-multi-column', complete: false},
            {name: 'Form', title: '表单尺寸', icon: 'pl-form', page: '/form/form-size', complete: false},
            {name: 'Form', title: '表单控制', icon: 'pl-form', page: '/form/form-edit-control', complete: false},
            {name: 'Form', title: '表单校验', icon: 'pl-form', page: '/form/form-validate', complete: false},
            {name: 'Form', title: '表单blur', icon: 'pl-form', page: '/form/form-blur', complete: false},
            {name: 'Form', title: '表单组件', icon: 'pl-form', page: '/form/form-elements', complete: false},
        ]
    },
    {
        name: '视图', children: [
            {name: 'List', title: '列表', icon: 'pl-list', page: '/normal/list', complete: true},
            {name: 'VirtualList', title: '虚拟列表', icon: 'pl-list', page: '/normal/virtual-list', complete: false},
            {name: 'Progress', title: '进度条', icon: 'pl-progress', page: '/normal/progress', complete: false},
            {name: 'Tree', title: '树形组件', icon: 'pl-tree', page: '/normal/tree', complete: false},
            {name: 'Virtual Tree', title: '虚拟树', icon: 'pl-tree', page: '/normal/virtual-tree', complete: false},
            {name: 'Pagination', title: '分页', icon: 'pl-book2', page: '/normal/pagination', complete: false},
            {name: 'Badge', title: '标记', icon: 'pl-badge', page: '/normal/badge', complete: false},
            {name: 'Step', title: '步骤条', icon: 'pl-step', page: '/normal/step', complete: false},
            {name: 'Tab', title: '页签', icon: 'pl-tabs', page: '/normal/tab', complete: false},
            // {name: 'Transform', title: '穿梭框', icon: 'pl-exchange', page: '/normal/transform', complete: false},
        ]
    },
    {
        name: '导航', children: [
            {name: 'NavTab', title: '页签导航', icon: 'pl-tabs', page: '/nav/nav-tab', complete: false},
            {name: 'NavPages', title: '页面导航', icon: 'pl-page', page: '/nav/nav-page', complete: false},
            {name: 'Nav', title: '应用导航', icon: 'pl-tabs', page: '/nav/nav', complete: false},
        ]
    },
    {
        name: '其他', children: [
            {name: 'Scroll', title: '滚动条', icon: 'icon-scroll', page: '/normal/scroll', complete: true},
            {name: 'Dialog', title: '对话框', icon: 'pl-window', page: '/normal/dialog', complete: true},
            {name: 'Tooltip', title: '文字提示', icon: 'pl-tooltip', page: '/normal/tooltip', complete: true},
            {name: 'Dropdown', title: '悬浮层', icon: 'pl-popper', page: '/normal/dropdown', complete: true},
            {name: 'Popover', title: '弹出框', icon: 'pl-popper', page: '/normal/popover', complete: true},
            {name: 'Popper', title: '悬浮框', icon: 'pl-popper', page: '/normal/popper', complete: true},
            {name: 'Card', title: '卡片', icon: 'pl-card', page: '/normal/card', complete: true},
            {name: 'Carousel', title: '轮播', icon: 'pl-carousel', page: '/normal/carousel', complete: false},
            {name: 'Collapse', title: '折叠面板', icon: 'pl-collapse', page: '/normal/collapse', complete: true},
            {name: 'Alert', title: '提示信息', icon: 'pl-collapse', page: '/normal/alert', complete: false},
            {name: 'Portal', title: '迁移DOM元素', icon: 'icon-scroll', page: '/normal/portal', complete: true},
        ]
    },
    {
        name: '服务', children: [
            {name: '$message', title: '消息服务', icon: 'pad-message', page: '/service/message-service', complete: true},
            {name: '$select', title: '选择服务', icon: 'pad-message', page: '/service/select-service', complete: false},
            // {name: '$popper', title: '悬浮框服务', icon: 'pad-message', page: '/service/popper-service', complete: false},
            {name: '$dialog', title: '对话框服务', icon: 'pl-window', page: '/service/dialog-service', complete: true},
            {name: '$notice', title: '通知', icon: 'pad-bell', page: '/service/notice-service', complete: true},
            {name: '$file', title: '文件服务', icon: 'pad-bell', page: '/service/file', complete: false},
        ]
    },
    {
        name: '表格', children: [
            {name: 'pl-virtual-table', title: '基础虚拟表格', icon: 'pl-table-solid', page: '/table/virtual-table', complete: false},
            {name: 'Table Basic', title: '基础表格', icon: 'pl-table-solid', page: '/table/table-basic', complete: false},
            {name: 'Table Fixed Column', title: '固定列', icon: 'pl-table-solid', page: '/table/table-fixed', complete: false},
            {name: 'Table Fill', title: '宽高填满父元素', icon: 'pl-table-solid', page: '/table/base-table-fit-parent', complete: false},
            {name: 'Table Basic Props', title: '基本属性', icon: 'pl-table-solid', page: '/table/base-table-props', complete: false},
            {name: 'Table Edit', title: '基本编辑', icon: 'pl-table-solid', page: '/table/base-table-edit', complete: false},
            {name: 'Table Column Props', title: '列属性', icon: 'pl-table-solid', page: '/table/base-table-column-prop', complete: false},
            {name: 'Table Dynamic Control', title: '列动态控制', icon: 'pl-table-solid', page: '/table/base-table-dynamic', complete: false},
            {name: 'Table Column Slots', title: '列插槽', icon: 'pl-table-solid', page: '/table/base-table-slot', complete: false},
            {name: 'Table Tooltip', title: '列显示', icon: 'pl-table-solid', page: '/table/base-table-tooltip', complete: false},
            {name: 'Table Columns', title: '列组件', icon: 'pl-table-solid', page: '/table/base-table-column', complete: false},
            {name: 'Table Methods', title: '方法', icon: 'pl-table-solid', page: '/table/base-table-methods', complete: false},
        ]
    },
    {name: '指令'},
    {
        name: '其他', children: [
            {name: 'Test', title: '测试手动渲染实例', icon: 'pl-table-solid', page: '/normal/test', complete: true},
            {name: 'Drag', title: '测试拖拽节点', icon: 'pl-table-solid', page: '/test/test-drag', complete: true},
            {name: 'Svg', title: '测试svg', icon: 'pl-table-solid', page: '/test/test-svg', complete: true},
            {name: 'Canvas', title: '测试canvas', icon: 'pl-table-solid', page: '/test/test-canvas', complete: true},
            {name: 'High', title: '测试高阶组件', icon: 'pl-table-solid', page: '/test/test-high', complete: true},
            {name: 'Listener', title: '测试事件', icon: 'pl-table-solid', page: '/test/test-listener', complete: true},
        ]
    },
]