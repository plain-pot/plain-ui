<template>
    <div>child:{{title}}</div>
</template>

<script>
    export default {
        name: "im-demo-child",
        props: {
            title: {},
        },
        mounted() {
            console.log(`child[${this.title}] mounted`)
        },
        destroyed(){
            console.log(`child[${this.title}] destroyed`)
        },
    }
</script>

<style lang="scss">

</style>