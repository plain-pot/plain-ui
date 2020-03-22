<template>
    <div class="demo-dropdown">
        <demo-row title="基本用法">
            <pl-dropdown ref="dropdown">
                <pl-button @click="onClick">https://</pl-button>
                <pl-dropdown-menu slot="dropdown">
                    <pl-dropdown-item label="新建"/>
                    <pl-dropdown-item label="编辑"/>
                    <pl-dropdown-item label="删除"/>
                    <pl-dropdown-item label="导入"/>
                    <pl-dropdown-item label="导出"/>
                    <pl-dropdown-item label="筛选"/>
                    <pl-dropdown-item label="排序"/>
                    <pl-dropdown-item label="多选"/>
                    <pl-dropdown-item label="设置"/>
                </pl-dropdown-menu>
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
                this.$refs.dropdown.toggle()
            },
        },
    }
</script>

<style lang="scss">
</style>