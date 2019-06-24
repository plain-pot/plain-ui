<template>
    <div class="demo-list">
        <demo-list-child/>
        <div ref="wrapper"></div>
    </div>
</template>

<script>
    import DemoListChild from "./demo-list-child";

    export default {
        name: "demo-list",
        components: {DemoListChild},
        mounted() {
            this.ins = this.$plain.newInstance(DemoListChild, this.$refs.wrapper)
        },
    }
</script>

<style lang="scss">

</style>