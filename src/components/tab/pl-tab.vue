<template>
    <span v-if="false"/>
</template>

<script>
    export default {
        name: "pl-tab",
        inject: ['plTabGroup'],
        props: {
            title: {type: String},
            val: {},
        },
        data() {
            return {
                index: 0,
            }
        },
        computed: {
            tabId() {
                return this.val != null ? this.val : this.index
            },
        },
        mounted() {
            this.plTabGroup.addItem(this)
        },
        beforeDestroy() {
            this.plTabGroup.removeItem(this)
        },
    }
</script>

<style lang="scss">
</style>