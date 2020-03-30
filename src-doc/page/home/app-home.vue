<template>
    <div class="app-home">
        <app-header @click-refresh="$refs.nav.refresh()"/>
        <app-menu @click-menu-item="menu=>this.$refs.nav.open(menu)" :currentPath="currentPath"/>
        <app-content>
            <app-navigator default-path="/normal/button" ref="nav" @open="onOpen"/>
        </app-content>
    </div>
</template>

<script>
    import AppContent from "./app-content";
    import AppHeader from "./app-header";
    import AppMenu from "./app-menu";
    import AppNavigator from "./app-navigator";

    const appHeadSize = 50
    const appMenuSize = 280

    export default {
        name: "app-home",
        components: {AppNavigator, AppMenu, AppHeader, AppContent},
        props: {},
        provide() {
            return {
                appHome: this,
            }
        },
        data() {
            return {
                appHeadSize,
                appMenuSize,
                currentPath: null,
            }
        },
        methods: {
            onOpen(path) {
                this.currentPath = path
            },
        },
    }
</script>

<style lang="scss">
    .app-home {
        height: 100%;
        width: 100%;

        .app-divider {
            background-color: #efefef;
            height: 16px;
            display: block;
        }
    }
</style>