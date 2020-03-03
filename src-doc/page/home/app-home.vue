<template>
    <div class="app-home">
        <app-header/>
        <app-content/>
    </div>
</template>

<script>
    import AppContent from "./app-content";
    import AppHeader from "./app-header";
    import AppMenu from "./app-menu";

    const appHeadSize = 50
    const appMenuSize = 280

    export default {
        name: "app-home",
        components: {AppMenu, AppHeader, AppContent},
        props: {},
        provide() {
            return {
                appHome: this
            }
        },
        data() {
            return {
                appHeadSize,
                appMenuSize,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
    .app-home {
        .app-divider {
            background-color: #f8f8f8;
            height: 16px;
            display: block;
        }
    }
</style>