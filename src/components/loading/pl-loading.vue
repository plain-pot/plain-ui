<template>
    <span class="pl-loading"/>
</template>

<script>

    import PlainLoading from 'plain-loading'

    export default {
        name: "pl-loading",
        props: {
            loading: {type: Boolean},
            type: {type: String, default: 'alpha'}
        },
        data() {
            return {
                loadingEl: null,
            }
        },
        watch: {
            type() {
                this.reset()
            },
            loading() {
                this.reset()
            },
        },
        mounted() {
            this.reset()
        },
        methods: {
            reset() {
                if (!PlainLoading[this.type]) {
                    console.error(`pl-loading: can't recognise loading type:${this.type}`)
                    return
                }
                const loadingEl = PlainLoading[this.type](this.loading)
                if (!!this.loadingEl) {
                    this.$el.replaceChild(loadingEl, this.loadingEl)
                } else {
                    this.$el.appendChild(loadingEl)
                }
                this.loadingEl = loadingEl
            },
        },
    }
</script>

<style lang="scss">
</style>