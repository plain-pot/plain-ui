<template>
    <div class="app-navigator">
        <component :is="PageComponent" v-if="PageComponent"/>
    </div>
</template>

<script>
    export default {
        name: "app-navigator",
        props: {
            defaultPath: {require: true},
        },
        data() {
            return {
                PageComponent: null,
            }
        },
        mounted() {
            this.init()

            window.addEventListener('hashchange', () => this.init())
        },
        methods: {
            async init() {
                let hash = window.location.hash || this.defaultPath;
                hash = hash.replace('#', '')
                this.openPage(hash)
            },
            async getPageComponent(path) {
                return (await import('src-doc/page' + path + '.vue')).default
            },
            async openPage(path) {
                this.PageComponent = await this.getPageComponent(path)
                window.location.hash = decodeURI(path)
            },
            async open(menu) {
                const path = menu.page
                this.openPage(path)
            },
        },
    }
</script>

<style lang="scss">
</style>