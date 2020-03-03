<template>
    <div class="app-header" :style="styles">
    </div>
</template>

<script>
    export default {
        name: "app-header",
        props: {
            appHeadSize: {},
        },
        inject: ['appHome'],
        data() {
            return {}
        },
        computed: {
            styles() {
                return {
                    height: `${this.appHome.appHeadSize}px`
                }
            },
        },
        methods: {},
    }
</script>

<style lang="scss">
    .app-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        border-bottom: solid 1px #dcdee2;
        box-shadow: 0 0 2px 1px #f1f1f1;
        background-color: white;
        z-index: 2;
    }
</style>