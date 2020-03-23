<template>
    <div class="demo-dropdown">
        <demo-row title="基本用法">
            <pl-dropdown ref="dropdown">
                <pl-button @click="$refs.dropdown.toggle()">https://</pl-button>
                <pl-dropdown-menu slot="dropdown">
                    <pl-dropdown-item label="新建" @click="$message('新建')"/>
                    <pl-dropdown-item label="编辑" @click="$message('编辑')"/>
                    <pl-dropdown-item label="删除" @click="$message('删除')"/>
                    <pl-dropdown-item label="导入" @click="$message('导入')"/>
                    <pl-dropdown-item label="导出" @click="$message('导出')"/>
                    <pl-dropdown-item label="筛选" @click="$message('筛选')"/>
                    <pl-dropdown-item label="排序" @click="$message('排序')"/>
                    <pl-dropdown-item label="多选" @click="$message('多选')"/>
                    <pl-dropdown-item label="设置" @click="$message('设置')"/>
                </pl-dropdown-menu>
            </pl-dropdown>
        </demo-row>
        <demo-row title="宽高设置">
            <pl-dropdown ref="sizeDropdown" width="100" height="200px">
                <pl-button @click="$refs.sizeDropdown.toggle()">https://</pl-button>
                <pl-dropdown-menu slot="dropdown">
                    <pl-dropdown-item label="新建" @click="$message('新建')"/>
                    <pl-dropdown-item label="编辑" @click="$message('编辑')"/>
                    <pl-dropdown-item label="删除" @click="$message('删除')"/>
                    <pl-dropdown-item label="导入" @click="$message('导入')"/>
                    <pl-dropdown-item label="导出" @click="$message('导出')"/>
                    <pl-dropdown-item label="筛选" @click="$message('筛选')"/>
                    <pl-dropdown-item label="排序" @click="$message('排序')"/>
                    <pl-dropdown-item label="多选" @click="$message('多选')"/>
                    <pl-dropdown-item label="设置" @click="$message('设置')"/>
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
        methods: {},
    }
</script>

<style lang="scss">
</style>