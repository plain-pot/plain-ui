<template>
    <div class="app-menu">
        <im-scroll fitHostWidth :scrollbarSize="6">
            <div class="app-menu-group" v-for="(menuGroup,index) in menuGroups" :key="index">
                <div class="app-menu-segment">
                    <span>{{menuGroup.title}}</span>
                </div>
                <div class="app-menu-item-wrapper">
                    <div class="app-menu-item" v-for="(item,menuIndex) in menuGroup.menus" :key="menuIndex" @click="$emit('click',item)" :class="{'app-menu-item-active':menu.title==item.title}">
                        <div>
                            <im-icon :icon="item.icon"/>
                            <span>{{item.title}}</span>
                        </div>
                        <im-icon icon="pad-check" v-if="item.complete"/>
                    </div>
                </div>
            </div>
        </im-scroll>
    </div>
</template>

<script>
    export default {
        name: "app-menu",
        props: {
            menu: {},
        },
        data() {
            return {
                menuGroups: [
                    {
                        title: 'PlainTable',
                        menus: [
                            {title: '基础编辑', icon: 'pl-table-solid', page: '/plain-table/demo-plain-table', complete: true},
                            {title: '父子表', icon: 'pl-table-solid', page: '/plain-table/demo-table-parent-child', complete: true},
                            {title: '导入模板', icon: 'pl-table-solid', page: '/plain-table/demo-imp-list', complete: true},
                            {title: '字段类型', icon: 'pl-table-solid', page: '/plain-table/demo-plain-table-field', complete: true},
                            {title: '图片列', icon: 'pl-table-solid', page: '/plain-table/demo-plain-table-img', complete: true},
                            {title: '列动态控制编辑必输', icon: 'pl-table-solid', page: '/plain-table/demo-plain-table-field-dynamic', complete: true},
                            {title: '对象选择', icon: 'pl-table-solid', page: '/plain-table/demo-plain-object', complete: true},
                            {title: '地址选择', icon: 'pl-table-solid', page: '/address/demo-address', complete: true},
                        ]
                    },
                    {
                        title: '业务组件',
                        menus: [
                            {title: '选项值', icon: 'pl-table-solid', page: '/ov/demo-ov', complete: true},
                            {title: '选项值列表', icon: 'pl-table-solid', page: '/ov/ov-list', complete: true},
                            {title: '地址选择器', icon: 'pl-table-solid', page: '/address/demo-address', complete: true},
                            {title: '图片上传', icon: 'pl-table-solid', page: '/normal/demo-pm-img', complete: true},
                        ],
                    },
                    {
                        title: '表格',
                        menus: [
                            {title: 'BaseTable基础表格', icon: 'pl-table-solid', page: '/table/demo-base-table', complete: true},
                            {title: 'BaseTable固定列', icon: 'pl-table-solid', page: '/table/demo-base-table-fixed', complete: true},
                            {title: 'BaseTable宽高填满父元素', icon: 'pl-table-solid', page: '/table/demo-base-table-fit-parent', complete: true},
                            {title: 'BaseTable基本属性', icon: 'pl-table-solid', page: '/table/demo-base-table-props', complete: true},
                            {title: 'BaseTable基本编辑', icon: 'pl-table-solid', page: '/table/demo-base-table-edit', complete: true},
                            {title: 'BaseTable列属性', icon: 'pl-table-solid', page: '/table/demo-base-table-column-prop', complete: true},
                            {title: 'BaseTable列动态控制', icon: 'pl-table-solid', page: '/table/demo-base-table-dynamic', complete: true},
                            {title: 'BaseTable列插槽', icon: 'pl-table-solid', page: '/table/demo-base-table-slot', complete: true},
                            {title: 'BaseTable列tooltip显示', icon: 'pl-table-solid', page: '/table/demo-base-table-tooltip', complete: true},
                            {title: 'BaseTable列组件', icon: 'pl-table-solid', page: '/table/demo-base-table-column', complete: true},
                            {title: 'BaseTable方法', icon: 'pl-table-solid', page: '/table/demo-base-table-methods', complete: true},
                        ],
                    },
                    {
                        title: '测试',
                        menus: [
                            {title: 'Test测试', icon: 'pl-tools', page: '/normal/demo-test', complete: true},
                            {title: 'Test测试2', icon: 'pl-tools', page: '/normal/demo-test2', complete: true},
                        ],
                    },
                    {
                        title: '基础',
                        menus: [
                            {title: 'Color颜色', icon: 'pl-color', page: '/normal/demo-color', complete: true},
                            {title: 'Icon图标', icon: 'pad-font-colors', page: '/normal/demo-icon', complete: true},
                            {title: 'Button按钮', icon: 'pad-play-circle', page: '/normal/demo-button', complete: true},
                            {title: 'Grid栅格', icon: 'pad-play-circle', page: '/normal/demo-grid', complete: true},
                            {title: 'Container容器', icon: 'pad-play-circle', page: '/normal/demo-container', complete: true},
                        ],
                    },
                    {
                        title: '表单',
                        menus: [
                            {title: 'Input输入框', icon: 'pl-edit-square-light', page: '/normal/demo-input', complete: true},
                            {title: 'Textarea文本域', icon: 'pl-textarea', page: '/normal/demo-textarea', complete: true},
                            {title: 'Radio单复选框', icon: 'pl-circle-radio', page: '/normal/demo-radio', complete: true},
                            {title: 'InputNumber数字输入', icon: 'pl-number', page: '/normal/demo-number', complete: true},
                            {title: 'Loading加载', icon: 'pl-loading-section-three', page: '/normal/demo-loading', complete: true},
                            {title: 'Select下拉选择', icon: 'pad-down', page: '/normal/demo-select', complete: true},
                            {title: 'Cascade级联选择', icon: 'pad-doubledown', page: '/normal/demo-cascade', complete: true},
                            {title: 'Toggle开关切换', icon: 'pl-toggle', page: '/normal/demo-toggle', complete: true},
                            {title: 'Slider滑块', icon: 'pl-slider', page: '/normal/demo-slider', complete: true},
                            {title: 'Timer时间选择', icon: 'pl-time-circle-light', page: '/normal/demo-time', complete: true},
                            {title: 'Date日期选择', icon: 'pl-date-fill', page: '/normal/demo-date', complete: true},
                            {title: 'Rate评分', icon: 'pad-star', page: '/normal/demo-rate', complete: true},
                            {title: 'ColorPicker颜色选择', icon: 'pl-color', page: '/normal/demo-color-picker', complete: true},
                            {title: 'Upload文件上传', icon: 'pad-file', page: '/normal/demo-upload', complete: true},
                            {title: 'Img图片上传', icon: 'pad-image', page: '/normal/demo-img', complete: true},
                            {title: 'Form表单', icon: 'pl-form', page: '/normal/demo-form', complete: true},
                        ],
                    },
                    {
                        title: '数据视图',
                        menus: [
                            {title: 'List列表', icon: 'pl-list', page: '/normal/demo-list', complete: true},
                            {title: 'Tag标签', icon: 'pl-icon-tag', page: '/normal/demo-tag', complete: true},
                            {title: 'Progress进度条', icon: 'pl-progress', page: '/normal/demo-progress', complete: true},
                            {title: 'Tree树形组件', icon: 'pl-tree', page: '/normal/demo-tree', complete: true},
                            {title: 'Pagination分页', icon: 'pl-book2', page: '/normal/demo-pagination', complete: true},
                            {title: 'Badge标记', icon: 'pl-badge', page: '/normal/demo-badge', complete: true},
                            {title: 'ScrollOption滚动选择', icon: 'icon-scroll', page: '/normal/demo-scroll-option', complete: true},
                            {title: 'Step步骤条', icon: 'pl-step', page: '/normal/demo-step', complete: true},
                            {title: 'Transform穿梭框', icon: 'pl-exchange', page: '/normal/demo-icon', complete: false},
                        ],
                    },

                    {
                        title: '导航',
                        menus: [
                            {title: 'Tabs页签', icon: 'pl-tabs', page: '/normal/demo-tabs', complete: true},
                            {title: 'TabsHeader页签标题', icon: 'pl-tabs', page: '/normal/demo-tab-header', complete: true},
                            {title: 'NavTab页签导航', icon: 'pl-tabs', page: '/nav/demo-nav-tab', complete: true},
                            {title: 'NavPages页面导航', icon: 'pl-page', page: '/nav/demo-nav-page', complete: true},
                            {title: 'Nav应用导航', icon: 'pl-tabs', page: '/nav/demo-nav', complete: true},

                        ],
                    },
                    {
                        title: '其他',
                        menus: [
                            {title: 'Scroll滚动条', icon: 'icon-scroll', page: '/normal/demo-scroll', complete: true},
                            {title: 'Dialog对话框', icon: 'pl-window', page: '/normal/demo-dialog', complete: true},
                            {title: 'Tooltip文字提示', icon: 'pl-tooltip', page: '/normal/demo-tooltip', complete: true},
                            {title: 'Dropdown悬浮层', icon: 'pl-popper', page: '/normal/demo-dropdown', complete: true},
                            {title: 'Popover弹出框', icon: 'pl-popper', page: '/normal/demo-popover', complete: true},
                            {title: 'Popper悬浮框', icon: 'pl-popper', page: '/normal/demo-popper', complete: true},
                            {title: 'Card卡片', icon: 'pl-card', page: '/normal/demo-card', complete: true},
                            {title: 'Carousel轮播', icon: 'pl-carousel', page: '/normal/demo-carousel', complete: true},
                            {title: 'Collapse折叠面板', icon: 'pl-collapse', page: '/normal/demo-collapse', complete: true},
                            {title: 'Dom', icon: 'icon-scroll', page: '/directive/demo-plain-dom', complete: true},
                        ],
                    },
                    {
                        title: '服务',
                        menus: [
                            {title: '$message消息服务', icon: 'pad-message', page: '/normal/demo-message', complete: true},
                            {title: '$select选择服务', icon: 'pad-message', page: '/service/demo-select-service', complete: true},
                            {title: '$dialog对话框服务', icon: 'pl-window', page: '/service/demo-dialog-service', complete: true},
                            {title: '$notice通知', icon: 'pad-bell', page: '/service/demo-notice-service', complete: true},
                            {title: '$file文件服务', icon: 'pad-bell', page: '/service/demo-file', complete: true},
                        ],
                    },
                    {
                        title: '指令',
                        menus: [],
                    },
                ],
            }
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .app-menu {
            color: plVar(colorContent);
            box-sizing: border-box;
            padding: plVar(padding);
            height: 100%;
            width: 100%;

            .app-menu-item-wrapper {
                padding: plVar(paddingSmall) 0;
                box-sizing: border-box;
            }

            .app-menu-item {
                border-radius: plVar(borderFillet);
                width: 100%;
                padding: plVar(paddingSmall) 0 plVar(paddingSmall) plVar(padding);
                box-sizing: border-box;
                font-size: plVar(fontSmall);
                color: plVar(colorContent);
                cursor: pointer;
                display: flex;
                justify-content: space-between;

                .pl-icon {
                    margin-right: 1em;
                }

                &.app-menu-item-active, &:hover {
                    background-color: plVar(colorPrimaryLighter);
                    color: plVar(colorPrimary);
                }
            }

            .app-menu-segment {
                display: flex;
                align-items: center;

                span {
                    font-size: plVar(fontSmall);
                    color: plVar(colorPrimary);
                    font-weight: 600;
                }
            }
        }
    }
</style>
