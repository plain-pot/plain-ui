<template>
    <div class="app-navigator">
        <component :is="PageComponent" v-if="PageComponent"/>
    </div>
</template>

<script>
    import {EmitMixin} from "../../../src/utils/mixins";

    export default {
        name: "app-navigator",
        mixins: [EmitMixin],
        props: {
            defaultPath: {require: true},
        },
        emitters: {
            emitOpen: null,
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
                try {
                    return (await import('src-doc/page' + path + '.vue')).default
                } catch (e) {
                    console.log(`未找到页面：` + path)
                    return null
                }
            },
            async openPage(path) {
                const PageComponent = await this.getPageComponent(path)
                if (!PageComponent) return
                window.location.hash = decodeURI(path)
                this.emitOpen(path)
                this.PageComponent = PageComponent
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