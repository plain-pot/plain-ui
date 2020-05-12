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
    @include theme {
        .app-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            box-shadow: $boxshadow;
        }
    }
</style>