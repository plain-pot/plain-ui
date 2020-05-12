<template>
    <header class="app-header" :style="rootStyles">
        app-header
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
            rootStyles() {
                return {
                    height: PlainUtils.suffixPx(this.appHome.headerHeight)
                }
            },
        },
    }
</script>

<style lang="scss">
    .app-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        box-shadow: 0 2px 8px #f0f1f2;
    }
</style>