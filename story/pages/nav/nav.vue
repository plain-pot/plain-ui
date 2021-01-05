<template>
    <div class="demo-nav">
        <demo-row title="基本用法">
            <demo-line>
                <pl-button-group>
                    <pl-button label="打开Button页面" @click="openButton"/>
                </pl-button-group>
            </demo-line>
            <pl-nav :nav="navigator" height="300px" width="100%"/>
        </demo-row>
    </div>
</template>

<script lang="ts">

    import {defineComponent} from 'vue'
    import {createNavigatorManager, NavRouteMode} from "../../../src/packages/nav/NavigatorManager";

    const navigator = createNavigatorManager({
        routerMode: NavRouteMode.hash,
        getPage: async (pageConfig) => {
            let {path} = pageConfig
            if (path.endsWith('.vue')) {
                path = path.slice(0, path.length - 4)
            }
            return (await import('story/pages/' + path)).default
        },
        defaultPage: {
            title: '主页',
            path: 'nav/nav-first-page',
        },
    })

    navigator.init()

    export default defineComponent({
        name: "demo-nav",
        data() {
            return {
                navigator,
            }
        },
        methods: {
            async openButton() {
                await this.navigator.openTab({
                    title: '页面二',
                    path: 'nav/nav-second-page'
                })
            },
        },
    })
</script>

<style lang="scss">

</style>