<template>
    <span class="plc">
        <slot></slot>
    </span>
</template>

<script>
    export default {
        name: "plc",
        mounted() {
            console.log('mounted plc')
        }
    }
</script>

<style lang="scss">

</style>