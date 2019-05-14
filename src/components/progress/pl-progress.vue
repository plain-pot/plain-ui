<template>
    <div class="pl-progress">
        <pl-progress-circle :value="50.5" ref="circle"/>
    </div>
</template>

<script>
    import PlProgressCircle from "./pl-progress-circle";

    export default {
        name: "pl-progress",
        components: {PlProgressCircle},
        methods: {
            reload() {
                this.$refs.circle.reload()
            },
        },
    }
</script>

<style lang="scss">

</style>