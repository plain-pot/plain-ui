<template>
    <app-home/>
</template>

<script>
    import AppHome from "./page/home/app-home";

    export default {
        name: "App",
        components: {AppHome},
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
    html, body {
        margin: 0;
        padding: 0;
    }
</style>