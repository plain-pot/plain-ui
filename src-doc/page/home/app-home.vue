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

    const DEMO_ROW_STORAGE_KEY = 'DEMO_ROW'

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

            let totalCache = localStorage.getItem(DEMO_ROW_STORAGE_KEY)
            totalCache = !!totalCache ? JSON.parse(totalCache) : {}

            return {
                appHeadSize,
                appMenuSize,
                currentPath: null,
                totalCache,
            }
        },
        computed: {
            pathCache() {
                return this.totalCache[this.currentPath] || {}
            },
        },
        methods: {
            onOpen(path) {
                this.currentPath = path
            },
            updateDemoRowCache(title, val) {
                const pathCache = this.pathCache
                pathCache[title] = val
                this.totalCache[this.currentPath] = pathCache
                localStorage.setItem(DEMO_ROW_STORAGE_KEY, JSON.stringify(this.totalCache))
            },
        },
    }
</script>

<style lang="scss">
    .app-home {
        .app-divider {
            background-color: #efefef;
            height: 16px;
            display: block;
        }
    }
</style>