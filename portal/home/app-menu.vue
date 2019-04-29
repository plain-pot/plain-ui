<template>
    <div class="app-menu">
        <im-scroll fitHostWidth>
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
                        title: '表格（新）',
                        menus: [
                            {title: 'BaseTable基础表格', icon: 'pl-table-solid', page: '/base-table/demo-base-table', complete: false},
                            {title: 'BaseTable基础表格列', icon: 'pl-table-solid', page: '/base-table/demo-base-table-column', complete: false},
                        ],
                    },
                    {
                        title: '表格',
                        menus: [
                            {title: 'BaseTable基础表格', icon: 'pl-table-solid', page: '/table/demo-base-table', complete: false},
                            {title: 'BaseTable基础表格编辑', icon: 'pl-table-solid', page: '/table/demo-base-table-edit', complete: false},
                            {title: 'BaseTable基础表格测试', icon: 'pl-table-solid', page: '/table/demo-base-table-test', complete: false},
                            {title: 'BaseTable列基本属性测试', icon: 'pl-table-solid', page: '/table/demo-base-table-column-prop', complete: false},
                            {title: 'BaseTable基础表格列测试', icon: 'pl-table-solid', page: '/table/demo-base-table-column', complete: false},
                        ],
                    },
                    {
                        title: '测试',
                        menus: [
                            {title: 'Test测试', icon: 'pl-tools', page: '/normal/demo-test', complete: true},
                            {title: 'Test测试2', icon: 'pl-tools', page: '/normal/demo-test2', complete: false},
                        ],
                    },
                    {
                        title: '基础',
                        menus: [
                            {title: 'Color颜色', icon: 'pl-color', page: '/normal/demo-color', complete: true},
                            {title: 'Icon图标', icon: 'pad-font-colors', page: '/normal/demo-icon', complete: true},
                            {title: 'Button按钮', icon: 'pad-play-circle', page: '/normal/demo-button', complete: true},
                        ],
                    },
                    {
                        title: '表单',
                        menus: [
                            {title: 'Input输入框', icon: 'pl-edit-square-light', page: '/normal/demo-input', complete: true},
                            {title: 'Textarea文本域', icon: 'pl-textarea', page: '/normal/demo-textarea', complete: true},
                            {title: 'Radio单复选框', icon: 'pl-circle-radio', page: '/normal/demo-radio', complete: true},
                            {title: 'InputNumber数字输入', icon: 'pl-number', page: '/normal/demo-number', complete: false},
                            {title: 'Loading加载', icon: 'pl-loading-section-three', page: '/normal/demo-loading', complete: true},
                            {title: 'Select下拉选择', icon: 'pad-down', page: '/normal/demo-select', complete: false},
                            {title: 'Cascade级联选择', icon: 'pad-doubledown', page: '/normal/demo-cascade', complete: false},
                            {title: 'Toggle开关切换', icon: 'pl-toggle', page: '/normal/demo-toggle', complete: true},
                            {title: 'Slider滑块', icon: 'pl-slider', page: '/normal/demo-slider', complete: false},
                            {title: 'Timer时间选择', icon: 'pl-time-circle-light', page: '/normal/demo-time', complete: false},
                            {title: 'Date日期选择', icon: 'pl-date-fill', page: '/normal/demo-date', complete: false},
                            {title: 'Rate评分', icon: 'pad-star', page: '/normal/demo-rate', complete: false},
                            {title: 'ColorPicker颜色选择', icon: 'pl-color', page: '/normal/demo-color-picker', complete: false},
                            {title: 'Transform穿梭框', icon: 'pl-exchange', page: '/normal/demo-icon', complete: false},
                            {title: 'Form表单', icon: 'pl-form', page: '/normal/demo-form', complete: true},
                        ],
                    },
                    {
                        title: '数据视图',
                        menus: [
                            {title: 'List列表', icon: 'pl-list', page: '/normal/demo-list', complete: true},
                            {title: 'Tag标签', icon: 'pl-icon-tag', page: '/normal/demo-tag', complete: false},
                            {title: 'Progress进度条', icon: 'pl-progress', page: '/normal/demo-progress', complete: false},
                            {title: 'Tree树形组件', icon: 'pl-tree', page: '/normal/demo-tree', complete: false},
                            {title: 'Pagination分页', icon: 'pl-book2', page: '/normal/demo-page-bar', complete: false},
                            {title: 'Badge标记', icon: 'pl-badge', page: '/normal/demo-badge', complete: false},
                            {title: 'ScrollOption滚动选择', icon: 'icon-scroll', page: '/normal/demo-scroll-option', complete: false},
                            {title: 'Mavon编辑器', icon: 'icon-code', page: '/normal/demo-mavon', complete: false},
                            {title: 'Steps步骤条', icon: 'pl-step', page: '/normal/demo-step', complete: false},
                        ],
                    },

                    {
                        title: '导航',
                        menus: [
                            {title: 'Tabs页签', icon: 'pl-tabs', page: '/normal/demo-tabs', complete: false},
                            {title: 'TabsHeader页签标题', icon: 'pl-tabs', page: '/normal/demo-tab-header', complete: false},
                            {title: 'NavigatorTab页签导航', icon: 'pl-tabs', page: '/navigator/demo-navigator-tab', complete: false},
                            {title: 'NavigatorPage页面导航', icon: 'pl-page', page: '/navigator/navigator-page/demo-navigator-page', complete: false},
                            {title: 'NavigatorMain系统导航', icon: 'pl-tabs-main', page: '/navigator/navigator-main/demo-navigator-main', complete: false},
                            {title: 'NavTabs页签导航', icon: 'pl-tabs', page: '/nav/tabs/demo-nav-tabs', complete: false},
                            {title: 'NavPages页面导航', icon: 'pl-page', page: '/nav/demo-nav-page', complete: false},

                        ],
                    },
                    {
                        title: '其他',
                        menus: [
                            {title: 'Scroll滚动条', icon: 'icon-scroll', page: '/normal/demo-scroll', complete: true},
                            {title: 'Dialog对话框', icon: 'pl-window', page: '/normal/demo-dialog', complete: false},
                            {title: 'Tooltip文字提示', icon: 'pl-tooltip', page: '/normal/demo-tooltip', complete: false},
                            {title: 'Dropdown悬浮层', icon: 'pl-popper', page: '/normal/demo-dropdown', complete: true},
                            {title: 'Popover弹出框', icon: 'pl-popper', page: '/normal/demo-popover', complete: false},
                            {title: 'Popper悬浮框', icon: 'pl-popper', page: '/normal/demo-popper', complete: true},
                            {title: 'Card卡片', icon: 'pl-card', page: '/normal/demo-card', complete: false},
                            {title: 'Carousel轮播', icon: 'pl-carousel', page: '/normal/demo-carousel', complete: false},
                            {title: 'Collapse折叠面板', icon: 'pl-collapse', page: '/normal/demo-collapse', complete: false},
                            {title: 'Dom', icon: 'icon-scroll', page: '/directive/demo-plain-dom', complete: true},
                        ],
                    },
                    {
                        title: '服务',
                        menus: [
                            {title: '$message消息服务', icon: 'pad-message', page: '/normal/demo-message', complete: true},
                            {title: '$select选择服务', icon: 'pad-message', page: '/service/demo-select-service', complete: true},
                            {title: '$dialog对话框服务', icon: 'pl-window', page: '/service/demo-dialog-service', complete: true},
                            {title: '$notice通知', icon: 'pad-bell', page: '/normal/demo-notice', complete: false},
                            {title: '$menu右击菜单', icon: 'pl-menu', page: '/normal/demo-context-menu', complete: false},
                            {title: '$popper下拉菜单', icon: 'pl-menu', page: '/service/demo-popper-service', complete: true},
                        ],
                    },
                    {
                        title: '指令',
                        menus: [
                        ],
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
                    color: plVar(colorTitle);
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