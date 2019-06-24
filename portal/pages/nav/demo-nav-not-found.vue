<template>
    <div class="demo-nav-not-found">
        <h2>页面不存在</h2>
        <h4>{{path}}</h4>
    </div>
</template>

<script>
    export default {
        name: "demo-nav-not-found",
        props: {
            path: {}
        },
    }
</script>

<style lang="scss">
    .demo-nav-not-found {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
</style>