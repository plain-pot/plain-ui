<template>
    <pro-home :menus="ProMenus" :nav="proNav"/>
</template>

<script>
    import {ProHome} from "./packages/home/home";
    import {ProMenus} from "./pro.menu";
    import {proNav} from "./pro.navigator";

    export default {
        name: "App",
        components: {
            ProHome,
        },
        data() {
            return {
                ProMenus,
                proNav,
            }
        },
    }
</script>

<style lang="scss">

</style>