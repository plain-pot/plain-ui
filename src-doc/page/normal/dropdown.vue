<template>
    <div class="demo-dropdown">
        <demo-row title="基本用法">
            <pl-dropdown ref="dropdown">
                <pl-button @click="onClick">https://</pl-button>
            </pl-dropdown>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-dropdown",
        props: {},
        data() {
            return {}
        },
        methods: {
            onClick() {
                this.$refs.dropdown.log()
            },
        },
    }
</script>

<style lang="scss">
</style>