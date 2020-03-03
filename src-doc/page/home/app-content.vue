<template>
    <div class="app-content" :style="styles">
        <slot name="header"/>
        <span class="app-divider"/>
        <div>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
            <h1>this is content</h1>
        </div>
    </div>
</template>

<script>
    export default {
        name: "app-content",
        inject: ['appHome'],
        props: {},
        data() {
            return {}
        },
        computed: {
            styles() {
                return {
                    paddingTop: `${this.appHome.appHeadSize}px`,
                    paddingLeft: `${this.appHome.appMenuSize}px`,
                }
            },
        },
        methods: {},
    }
</script>

<style lang="scss">
    .app-content {
        width: 100%;
        box-sizing: border-box;
    }
</style>