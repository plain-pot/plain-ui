<template>
    <div class="app-menu" :style="styles">
        <span class="app-divider"/>
    </div>
</template>

<script>
    export default {
        name: "app-menu",
        inject: ['appHome'],
        props: {},
        data() {
            return {}
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
        border-right: solid 1px #dcdee2;
        position: fixed;
        left: 0;
        bottom: 0;
        background-color: white;
    }
</style>