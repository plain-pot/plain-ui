<template>
    <div class="demo-virtual-list">
        <demo-row title="基本用法">
            <div class="demo-virtual-list-container">
                <pl-virtual-list>

                </pl-virtual-list>
            </div>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-virtual-list",
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
    .demo-virtual-list-container {
        width: 300px;
        height: 500px;
        background-color: #f6f6f6;
    }
</style>