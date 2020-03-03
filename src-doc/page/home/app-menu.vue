<template>
    <div class="app-menu" :style="styles">
        <span class="app-divider"/>
        <pl-scroll>
            <div class="app-menu-list">
                <ul>
                    <li v-for="menuGroup in menus" :key="menuGroup.name">
                        <div class="app-menu-group-name">{{menuGroup.name}}</div>
                        <ul>
                            <li v-for="menu in menuGroup.children" :key="menu.title">
                                <div class="app-menu-name">
                                    <span>{{menu.name}}</span>
                                    <span>{{menu.title}}</span>
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

    import menus from 'src-doc/menus'

    export default {
        name: "app-menu",
        inject: ['appHome'],
        props: {},
        data() {
            return {
                menus,
            }
        },
        computed: {
            styles() {
                return {
                    width: `${this.appHome.appMenuSize}px`,
                    top: `${this.appHome.appHeadSize}px`
                }
            },
        },
        methods: {},
    }
</script>

<style lang="scss">
    .app-menu {
        border-right: solid 1px #efefef;
        position: fixed;
        left: 0;
        bottom: 0;
        background-color: white;
        z-index: 1;
        padding-top: 16px;

        & > .app-divider {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
        }

        .app-menu-list {
            padding: 14px 0;

            ul {
                margin: 0;
                padding: 0;

                li {
                    list-style: none;
                }
            }

            .app-menu-group-name, .app-menu-name {
                padding: 13px 24px;
                font-size: 14px;
            }

            .app-menu-group-name {
                color: #9999;
            }

            .app-menu-name {
                & > span:first-child {
                    margin-right: 1em;
                    font-size: 14px;
                    color: #666;
                }

                & > span:last-child {
                    font-size: 12px;
                    color: #aaa;
                }
            }
        }
    }

    @include themify {
        .app-menu-list {
            .app-menu-name {
                &:hover {
                    cursor: pointer;

                    span {
                        color: rgba($colorPrimary, 0.8) !important;
                    }
                }
            }
        }
    }
</style>