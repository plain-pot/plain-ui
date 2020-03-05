<template>
    <i :class="icon" class="pl-icon"/>
</template>

<script>

    import 'src/styles/fonts/element-icons.ttf'
    import 'src/styles/fonts/element-icons.woff'

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