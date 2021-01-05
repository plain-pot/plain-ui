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
        defaultPage: {
            title: '主页',
            path: 'nav/',
        },
    })

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