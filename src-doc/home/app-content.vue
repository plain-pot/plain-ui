<template>
    <div class="app-content" :style="rootStyles">
        <div class="app-content-body">
            <pl-button width="300px" :label="label"></pl-button>
            <pl-icon icon="el-icon-search"/>
        </div>
    </div>
</template>

<script>
    import PlainUtils from "../../submodules/plain-utils";

    export default {
        name: "app-content",
        inject: {
            appHome: {}
        },
        data() {
            return {
                label: new Promise((resolve) => {
                    setTimeout(() => resolve('HELLO'), 2000)
                })
            }
        },
        computed: {
            rootStyles() {
                return {
                    paddingTop: PlainUtils.suffixPx(this.appHome.headerHeight),
                    paddingLeft: PlainUtils.suffixPx(this.appHome.menuWidth),
                    paddingRight: '1px',
                }
            },
        },
    }
</script>

<style lang="scss">
    .app-content {
        box-sizing: border-box;
        width: 100%;

        .app-content-body {
            padding: 16px;
            min-height: calc(100vh - 100px);
        }
    }
</style>