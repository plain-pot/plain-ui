<template>
    <div class="app-menu" :style="rootStyles">
        app-menu
    </div>
</template>

<script>
    import PlainUtils from "../../submodules/plain-utils";

    export default {
        name: "app-menu",
        inject: {
            appHome: {}
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
    .app-menu {
        position: fixed;
        left: 0;
        bottom: 16px;
        overflow: hidden;
        border-right: solid 1px #f0f0f0;
    }
</style>