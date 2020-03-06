<template>
    <i :class="icon" class="pl-icon"/>
</template>

<script>

    import 'element-theme-chalk/lib/icon.css'

    export default {
        name: "pl-icon",
        props: {
            icon: {},
        },
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>