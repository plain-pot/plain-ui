<template>
    <div class="app-content">
        <pl-scroll :style="styles" scrollbar-color="rgba(0,0,0,0.35)">
            <span class="app-divider"/>
            <div class="app-content-body">
                <slot></slot>
            </div>
        </pl-scroll>
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
        height: 100%;
        box-sizing: border-box;
        z-index: 0;

        & > .pl-scroll .pl-vertical-scrollbar-wrapper .pl-vertical-scrollbar {
            z-index: 3;
        }

        .app-content-body {
            padding: 16px 0;
        }

        .test-block {
            height: 100px;
            background-color: #f6f6f6;
            margin-bottom: 10px;
        }
    }
</style>