<template>
    <div class="app-home">
        <app-header/>
        <app-content/>
        <app-menu/>
    </div>
</template>

<script>
    import AppContent from "./app-content";
    import AppHeader from "./app-header";
    import AppMenu from "./app-menu";

    export default {
        name: "app-home",
        components: {AppMenu, AppHeader, AppContent},
        props: {
            headerHeight: {type: Number, default: 64},
            menuWidth: {type: Number, default: 280},
        },
        provide() {
            return {
                appHome: this,
            }
        },
        data() {
            return {
                show: true,
            }
        },
    }
</script>

<style lang="scss">
    .app-home {
    }
</style>