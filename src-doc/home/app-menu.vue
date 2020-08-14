<template>
    <div class="app-menu" :style="rootStyles">
        <pl-scroll>
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
        </pl-scroll>
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
                    this.$emit('click-menu-item', menu)
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

            ul {
                list-style: none;
                margin: 0;
                padding: 0;

                .app-menu-name, .app-menu-group-name {
                    font-size: 13px;
                    height: 40px;
                    line-height: 40px;
                    white-space: nowrap;
                    margin-bottom: 8px;
                    margin-top: 4px;
                    color: $itc;
                    padding-left: 32px;
                    cursor: pointer;
                    transition: all 300ms linear;

                    &:hover {
                        background-color: rgba($colorPrimary, 0.1);
                        color: $colorPrimary;
                    }
                }

                .app-menu-name {
                    position: relative;

                    & > span {
                        &:nth-child(2) {
                            font-size: 12px;
                            margin-left: 0.5em;
                            color: $itl;
                        }
                    }

                    .pl-icon {
                        position: absolute;
                        right: 16px;
                        line-height: 40px;
                    }
                }

                .app-menu-group-name {
                    padding-left: 20px;
                    letter-spacing: 1px;
                    font-size: 12px;
                    font-weight: 600;
                    color: $ihc;
                }
            }

            &:after {
                position: absolute;
                top: 0;
                bottom: 0;
                right: -30px;
                width: 30px;
                content: '';
                box-shadow: inset 10px 0 8px -8px #f0f1f2;
            }
        }
    }
</style>