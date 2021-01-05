<template>
    <div class="demo-nav">
        <demo-row>
            <pl-nav :nav="navigator" height="300px" width="100%"/>
        </demo-row>
    </div>
</template>

<script lang="ts">

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

    export default {
        name: "demo-nav",
        data() {
            return {
                navigator,
            }
        },
    }
</script>

<style lang="scss">

</style>