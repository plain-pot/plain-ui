<template>
    <div class="app-content" :style="rootStyles">
        <div class="app-content-body">
            <slot></slot>
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
                    setTimeout(() => resolve('HELLO'), 1000)
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
        methods: {
            onClick(e) {
                console.log('click', new Date().getTime(), e,)
            },
        },
    }
</script>

<style lang="scss">
    .app-content {
        box-sizing: border-box;
        width: 100%;

        .app-content-body {
            margin: 0 auto;
            text-align: left;
            width: 800px;
            min-height: calc(100vh - 200px);
            padding: 36px 0;
        }
    }
</style>