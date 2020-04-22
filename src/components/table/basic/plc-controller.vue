<template>
    <span class="plc-controller">
        <slot></slot>
    </span>
</template>

<script>
    export default {
        name: "plc-controller",
        provide() {
            return {
                plcNode: this,
            }
        },
        data() {
            return {
                items: [],
            }
        },
        methods: {
            addItem(item) {
            },
            removeItem() {

            },
        },
    }
</script>

<style lang="scss">

</style>