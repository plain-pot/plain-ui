<template>
    <pro-home :menus="ProMenus" :nav="navigator"/>
</template>

<script>
    import {ProHome} from "./packages/home/home";
    import {ProMenus} from "./pro.menu";
    import {createNavigatorManager, NavRouteMode} from "../src/packages/nav/NavigatorManager";

    const navigator = createNavigatorManager({
        routerMode: NavRouteMode.hash,
        getPage: async (pageConfig) => {
            let {path} = pageConfig
            if (path.endsWith('.vue')) {
                path = path.slice(0, path.length - 4)
            }
            return (await import('pro/pages/' + path)).default
        },
        defaultPage: {
            title: '页面一',
            path: 'nav/nav-first-page',
            icon: 'el-icon-s-shop',
        },
    })

    navigator.init()

    export default {
        name: "App",
        components: {
            ProHome,
        },
        data() {
            return {
                ProMenus,
                navigator,
            }
        },
    }
</script>

<style lang="scss">

</style>