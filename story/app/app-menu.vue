<template>
    <section class="app-menu">
        <div class="app-menu-list">
            <ul>
                <li v-for="menuGroup in menus" :key="menuGroup.name">
                    <div class="app-menu-group-name">
                        <span>{{menuGroup.name}}</span>
                    </div>
                    <ul>
                        <li v-for="menu in menuGroup.children" :key="menu.title" @click="handleClickMenu(menu)" :class="{'app-menu-active':currentPath === menu.page}">
                            <div class="app-menu-name">
                                <span>{{menu.name}}</span>
                                <span>{{menu.title}}</span>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    import {MENUS} from "../menu";
    import {AppNavigator} from "./app-navigator";

    export default {
        name: "app-menu",
        props: {
            currentPath: {type: String},
        },
        setup() {

            const navigator = AppNavigator.use.inject()

            return {
                menus: MENUS,
                handleClickMenu(menu) {
                    navigator.nav.go(menu.page)
                },
            }
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

                .app-menu-name {

                    display: block;
                    margin: 8px 0;
                    padding: 8px 0 8px 24px;
                    color: #455a64;
                    font-size: 14px;
                    line-height: 20px;
                    transition: color 0.2s;
                    cursor: pointer;

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
                            color: #ccc;
                        }
                    }

                    .pl-icon {
                        position: absolute;
                        right: 16px;
                        line-height: 40px;
                    }
                }

                .app-menu-group-name {
                    padding: 8px 0 8px 24px;
                    color: #455a64;
                    font-weight: 600;
                    font-size: 15px;
                    line-height: 28px;
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