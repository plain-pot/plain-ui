<template>
    <div class="app-navigator">
        <component :is="PageComponent" v-if="PageComponent" :key="key"/>
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
                key: 0,
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
            async refresh() {
                this.key++
            },
            async openPage(path) {
                const PageComponent = await this.getPageComponent(path)
                if (!PageComponent) return
                window.location.hash = decodeURI(path)
                this.$emit('open', 'path')
                this.PageComponent = PageComponent
            },
            async getPageComponent(path) {
                try {
                    return (await import('src-doc/page' + path + '.vue')).default
                } catch (e) {
                    console.log(`未找到页面：` + path)
                    return null
                }
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