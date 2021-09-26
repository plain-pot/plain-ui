import {reactive} from "vue";
import {Router} from "./navigator.utils";

export interface Menu {
    name: string,
    title?: string,
    page: string,
    complete?: boolean,
}

interface MenuGroup {
    name: string,
    children: Menu[],
}

const MenuData: MenuGroup[] = [
    {
        name: '测试', children: [
            {name: 'Test', title: '测试手动渲染实例', page: '/test/TestGroupTransition', complete: true},
            /*{name: 'Drag', title: '测试拖拽节点', page: '/test/test-drag', complete: false},
            {name: 'Svg', title: '测试svg', page: '/test/test-svg', complete: false},
            {name: 'Canvas', title: '测试canvas', page: '/test/test-canvas', complete: false},
            {name: 'High', title: '测试高阶组件', page: '/test/test-high', complete: false},
            {name: 'Listener', title: '测试事件', page: '/test/test-listener', complete: false},
            {name: 'Filter', title: '异步过滤器', page: '/test/test-filter', complete: false},
            {name: 'List Draggier', title: '列表拖拽排序', page: '/test/test-list-draggier', complete: false},
            {name: '传递属性给根节点组件热更新报错', title: '列表拖拽排序', page: '/test/test-pass-attrs-hot-reload/test-pass-attrs-hot-reload', complete: false},*/
        ]
    },
    {
        name: '组合函数', children: [
            {name: 'useSlots', page: '/use/DemoUseSlots', complete: false},
            {name: 'useScopedSlots', page: '/use/DemoUseScopedSlots', complete: false},
            {name: 'useModel', page: '/use/DemoUseModel', complete: false},
            {name: 'useStyles', page: '/use/DemoUseStyles', complete: false},
            {name: 'useStyle', page: '/use/DemoUseStyle', complete: false},
            {name: 'useRefs', page: '/use/DemoUseRefs', complete: false},
            {name: 'useRefList', page: '/use/DemoUseRefList', complete: false},
            {name: 'useEvent', page: '/use/DemoUseEvent', complete: false},
            // {name: 'useProps', page: '/use/useProps', complete: false},
            {name: 'useCollect', page: '/use/DemoUseCollect', complete: false},
            {name: 'PlTransition', page: '/normal/DemoTransition', complete: false},
            {name: 'PlCollapseTransition', page: '/normal/DemoCollapseTransition', complete: false},
        ]
    },
    {
        name: '基础', children: [
            {name: 'Color', title: '颜色', page: '/normal/DemoColor', complete: true},
            {name: 'Icon', title: '图标', page: '/normal/DemoIcon', complete: true},
            {name: 'Button', title: '按钮', page: '/normal/DemoButton', complete: true},
            {name: 'Grid', title: '栅格', page: '/normal/DemoGrid', complete: true},
        ]
    },
    {
        name: '表单元素', children: [
            {name: 'Input', title: '输入框', page: '/normal/DemoInput', complete: true},
            {name: 'Radio', title: '单选框', page: '/normal/DemoRadio', complete: true},
            {name: 'Checkbox', title: '复选框', page: '/normal/DemoCheckbox', complete: true},
            {name: 'Number', title: '数字输入', page: '/normal/DemoNumber', complete: false},
            {name: 'Loading', title: '加载', page: '/normal/DemoLoading', complete: true},
            {name: 'Select', title: '下拉选择', page: '/normal/DemoSelect', complete: false},
            {name: 'Toggle', title: '开关切换', page: '/normal/DemoToggle', complete: false},
            {name: 'Slider', title: '滑块', page: '/normal/DemoSlider', complete: false},
            {name: 'Tag', title: '标签', page: '/normal/DemoTag', complete: false},
            {name: 'Rate', title: '评分', page: '/normal/DemoRate', complete: false},
            {name: 'ColorPicker', title: '颜色选择', page: '/normal/DemoColorPicker', complete: false},

            {name: 'Cascade', title: '级联选择', page: '/normal/DemoCascade', complete: false},
            {name: 'Time', title: '时间选择', page: '/normal/DemoTime', complete: false},
            {name: 'Date', title: '日期选择', page: '/normal/DemoDate', complete: false},
            {name: 'Upload', title: '文件上传', page: '/normal/DemoUpload', complete: false},
            {name: 'Img', title: '图片上传', page: '/normal/DemoImage', complete: false},
        ]
    },
    {
        name: '表单示例', children: [
            {name: 'Form', title: '表单基础', page: '/form/DemoFormBasic', complete: false},
            {name: 'Form', title: '表单多列', page: '/form/DemoFormGrid', complete: false},
            {name: 'Form', title: '纵向表单', page: '/form/DemoFormVerticalLabel', complete: false},
            {name: 'Form', title: '表单尺寸', page: '/form/DemoFormSize', complete: false},
            {name: 'Form', title: '表单控制', page: '/form/DemoFormEditControl', complete: false},
            {name: 'Form', title: '校验blur', page: '/form/DemoFormBlur', complete: false},
            {name: 'Form', title: '表单组件', page: '/form/DemoFormElement', complete: false},
            {name: 'Form', title: '表单校验', page: '/form/DemoFormValidate', complete: false},
            {name: 'Form', title: '关联字段', page: '/form/DemoFormAssociateFields', complete: false},
            {name: 'Form', title: '校验模式', page: '/form/DemoFormValidateMode', complete: false},
            {name: 'Form', title: '动态表单项', page: '/form/DemoFormDynamicFields', complete: false},
        ]
    },
    {
        name: '视图', children: [
            {name: 'List', title: '列表', page: '/normal/DemoList', complete: false},
            {name: 'VirtualList', title: '虚拟列表', page: '/normal/DemoVirtualList', complete: false},
            {name: 'Progress', title: '进度条', page: '/normal/DemoProgress', complete: false},
            {name: 'Tree', title: '树形组件', page: '/normal/DemoTree', complete: false},
            // {name: 'Virtual Tree', title: '虚拟树', page: '/normal/virtual-tree', complete: false},
            {name: 'Pagination', title: '分页', page: '/normal/DemoPagination', complete: false},
            {name: 'Badge', title: '标记', page: '/normal/DemoBadge', complete: false},
            {name: 'Step', title: '步骤条', page: '/normal/DemoStep', complete: false},
            {name: 'Tab', title: '页签', page: '/normal/DemoTab', complete: false},
        ]
    },
    /*{
        name: '导航', children: [
            {name: 'NavPageStack', title: '页面导航', page: '/nav/nav-page-stack', complete: false},
            {name: 'Nav', title: '应用导航', page: '/nav/nav', complete: false},
        ]
    },*/
    {
        name: '其他', children: [
            {name: 'Scroll', title: '滚动条', page: '/normal/DemoScroll', complete: false},
            {name: 'Dialog', title: '对话框', page: '/normal/DemoDialog', complete: false},
            {name: 'Tooltip', title: '文字提示', page: '/normal/DemoTooltip', complete: false},
            {name: 'Dropdown', title: '下拉菜单', page: '/normal/DemoDropdown', complete: false},
            // {name: 'Popover', title: '弹出框', page: '/normal/popover', complete: false},
            {name: 'Popper', title: '悬浮框', page: '/normal/DemoPopper', complete: false},
            {name: 'Card', title: '卡片', page: '/normal/DemoCard', complete: false},
            {name: 'Carousel', title: '轮播', page: '/normal/DemoCarousel', complete: false},
            {name: 'Collapse', title: '折叠面板', page: '/normal/DemoCollapse', complete: false},
            {name: 'Alert', title: '提示信息', page: '/normal/DemoAlert', complete: false},
            // {name: 'Triangle', title: '三角形元素', page: '/normal/triangle', complete: false},
            // {name: 'FilletCorner', title: '圆角', page: '/normal/fillet-corner', complete: false},
            // {name: 'TabHeader', title: '页签头组件', page: '/normal/tab-header', complete: false},
        ]
    },
    {
        name: '服务', children: [
            {name: '$message', title: '消息服务', page: '/service/message-service', complete: true},
            // {name: '$popper', title: '浮层服务', page: '/service/popper-service', complete: false},
            // {name: '$select', title: '选择服务', page: '/service/select-service', complete: false},
            {name: '$dialog', title: '对话框服务', page: '/service/dialog-service', complete: false},
            {name: '$notice', title: '通知', page: '/service/notice-service', complete: true},
            {name: '$contextmenu', title: '菜单服务', page: '/service/contextmenu-service', complete: true},
            {name: '$file', title: '文件服务', page: '/service/file-service', complete: true},
            // {name: '$image', title: '图片服务', page: '/service/image-service', complete: true},
        ]
    },
    {
        name: '表格', children: [
            {name: 'Virtual', title: 'pl-virtual-table', page: '/table/DemoVirtualTable', complete: false},
            {name: 'Basic', title: '基础表格', page: '/table/DemoTableBasic', complete: false},
            // {name: 'Test', title: '基础测试', page: '/table/table-base-test', complete: false},
            {name: 'Config', title: '自定义配置', page: '/table/DemoTableConfig', complete: false},
            {name: 'Fixed', title: '固定列', page: '/table/DemoTableFixed', complete: false},
            {name: 'Slots', title: '列作用域插槽', page: '/table/DemoTableSlots', complete: false},

            {name: 'Edit Control', title: '编辑控制', page: '/table/DemoTableEdit', complete: false},
            {name: 'Plc', title: '列组件', page: '/table/DemoTableColumns', complete: false},
            {name: 'Expand', title: '展开列', page: '/table/DemoTableExpand', complete: false},
            {name: 'Span', title: '合并单元格', page: '/table/DemoTableSpan', complete: false},
            {name: 'Tree', title: '树形表格', page: '/table/DemoTableTree', complete: false},
            {name: 'Row Draggable', title: '行拖拽排序', page: '/table/DemoTableRowDraggable', complete: false},
            {name: 'Col Draggable', title: '列拖拽排序', page: '/table/DemoTableColDraggable', complete: false},
            {name: 'Table class-style', title: '行列样式', page: '/table/DemoTableClassAndStyle', complete: false},
        ]
    },
    {
        name: 'table-pro', children: [
            {name: '基本示例', title: 'pl-table-pro', page: '/table-pro/basic-usage', complete: false},
            {name: '分组示例', title: 'pl-table-pro', page: '/table-pro/group-usage', complete: false},
            {name: '默认搜索', title: 'pl-table-pro', page: '/table-pro/default-filter', complete: false},
            {name: '自动高度', title: 'pl-table-pro', page: '/table-pro/table-fill', complete: false},
            {name: '筛选组件', title: 'pl-filter', page: '/table-pro/pro-filter', complete: false},
            {name: '对象选择', title: 'pl-object', page: '/table-pro/demo-object', complete: false},
            {name: '父子表', title: 'table parent', page: '/table-pro/table-parent', complete: false},
            {name: '地址组件', title: 'table address', page: '/table-pro/demo-address', complete: false},
            {name: '行数据格式化', title: 'format row', page: '/table-pro/format-row', complete: false},
            {name: '文件列表', title: 'file list', page: '/table-pro/table-files', complete: false},
            {name: '选项集', title: 'option value', page: '/table-pro/option-value', complete: false},
            {name: '图片列', title: 'image column', page: '/table-pro/production-list', complete: false},
        ]
    },
    /*{
        name: 'Sticky Table',
        children: [
            {name: 'Sticky Table', title: '另一种形式的表格', page: '/sticky-table/demo-sticky-table', complete: false},
            {name: 'Sticky', title: '粘粘组件', page: '/sticky-table/demo-sticky', complete: false},
        ]
    },
    */

]

export const Menu = (() => {
    const state = reactive({
        data: MenuData,
        openMenu: (menu: Menu) => {Router.go(menu.page)},
    })
    return state
})();

