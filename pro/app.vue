<template>
    <pro-home :menus="ProMenus"/>
</template>

<script>
    import {ProHome} from "./packages/home/home";
    import {ProMenus} from "./pro.menu";

    export default {
        name: "App",
        components: {
            ProHome,
        },
        data() {
            return {
                ProMenus,
            }
        },
    }
</script>

<style lang="scss">

</style>