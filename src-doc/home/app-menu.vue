<template>
    <div class="app-menu" :style="rootStyles">
        <div class="app-menu-list">
            <ul>
                <li v-for="menuGroup in menus" :key="menuGroup.name">
                    <div class="app-menu-group-name">
                        <pl-icon icon="plc-diamond" status="primary"/>
                        <span>{{menuGroup.name}}</span>
                    </div>
                    <ul>
                        <li v-for="menu in menuGroup.children" :key="menu.title" @click="handleClickMenu(menu)" :class="{'app-menu-active':currentPath === menu.page}">
                            <div class="app-menu-name">
                                <span>{{menu.name}}</span>
                                <span>{{menu.title}}</span>
                                <pl-icon icon="el-icon-star-on" status="primary" v-if="!!menu.complete"/>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import PlainUtils from "../../submodules/plain-utils";
    import menus from '../menus'

    export default {
        name: "app-menu",
        inject: {
            appHome: {}
        },
        props: {
            currentPath: {type: String},
        },
        data() {
            return {
                menus,
                handleClickMenu(menu) {
                    // this.emitClickMenuItem(menu)
                },
            }
        },
        computed: {
            rootStyles() {
                return {
                    width: PlainUtils.suffixPx(this.appHome.menuWidth),
                    top: PlainUtils.suffixPx(this.appHome.headerHeight + 16),
                }
            },
        },
    }
</script>

<style lang="scss">
    @include theme {
        .app-menu {
            position: fixed;
            left: 0;
            bottom: 16px;
            overflow-y: auto;
            border-right: solid 1px #f0f0f0;

            ul {
                list-style: none;
                margin: 0;
                padding: 0;

                .app-menu-name, .app-menu-group-name {
                    font-size: 14px;
                    height: 40px;
                    line-height: 40px;
                    white-space: nowrap;
                    margin-bottom: 8px;
                    margin-top: 4px;
                    color: $itc;
                    padding-left: 40px;

                    &:hover {

                    }
                }

                .app-menu-group-name {
                    padding-left: 20px;
                    letter-spacing: 1px;
                }
            }
        }
    }
</style>