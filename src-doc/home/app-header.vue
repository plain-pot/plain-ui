<template>
    <header class="app-header" :style="rootStyles">
        <div class="app-header-left" :style="leftStyle">
            <plain-logo/>
        </div>
        <ul class="app-header-right">
            <li>
                <a :href="codeUrl" target="_blank">
                    <pl-button mode="text">
                        {{codeUrl}}
                    </pl-button>
                </a>
            </li>
            <li>文档</li>
            <li>示例</li>
            <li>PLAIN</li>
            <li>
                <a href="https://gitee.com/plain-pot/plain-ui/blob/master" target="_blank">
                    <pl-icon icon="plc-gitee" status="primary"/>
                </a>
            </li>
            <!--<li>
                <pl-icon icon="plc-git"/>
            </li>-->
        </ul>
    </header>
</template>

<script>
    import PlainUtils from "../../submodules/plain-utils";

    export default {
        name: "app-header",
        inject: {
            appHome: {}
        },
        computed: {
            codeUrl() {
                return `https://gitee.com/plain-pot/plain-ui/tree/master/src-doc/page${this.appHome.currentPath}.vue`
            },
            leftStyle() {
                return {
                    width: PlainUtils.suffixPx(this.appHome.menuWidth)
                }
            },
            rootStyles() {
                return {
                    height: PlainUtils.suffixPx(this.appHome.headerHeight)
                }
            },
        },
    }
</script>

<style lang="scss">
    @include theme {
        .app-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            box-shadow: $boxshadow;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: white;
            z-index: 2;

            .app-header-left {
                text-align: center;
            }

            .app-header-right {
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding-right: 64px;
                list-style: none;

                & > li {
                    padding: 0 24px;
                    font-size: 14px;
                    cursor: pointer;
                    color: $itl;
                    height: 100%;
                    display: flex;
                    align-items: center;

                    &:hover {
                        color: $colorPrimary;
                    }

                    &:last-child {
                        padding-right: 12px;
                    }
                }
            }
        }
    }
</style>