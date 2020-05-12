<template>
    <div id="app">
        <app-home/>
    </div>
</template>

<script>
    import AppHome from "./home/app-home";

    export default {
        name: "App",
        components: {AppHome},
        data() {
            return {}
        },
    }
</script>

<style lang="scss">
    html, body {
        margin: 0;
        padding: 0;

        #app {
            width: 100%;
        }
    }
</style>