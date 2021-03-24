<template>
    <div class="contextmenu-service">
        <demo-row title="reference类型">
            <pl-button label="右键菜单" @contextmenu="useByContextmenu"/>
            <pl-button label="单击菜单" @click="useByClick"/>
            <pl-button label="目标菜单" @click="useByReference"/>
        </demo-row>
        <demo-row title="选项图标">
            <pl-button label="单击菜单" @click="useWithIcon"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "contextmenu-service",
        methods: {
            useByContextmenu(e) {
                e.preventDefault()
                this.useByClick(e)
            },
            useByClick(e) {
                this.$contextmenu(e, () => (
                    <pl-dropdown-menu>
                        <pl-dropdown-option>第一个选项</pl-dropdown-option>
                        <pl-dropdown-option>第二个选项</pl-dropdown-option>
                        <pl-dropdown-option>第三个选项</pl-dropdown-option>
                    </pl-dropdown-menu>
                ))
            },
            useByReference(e) {
                this.$contextmenu(e.currentTarget, () => (
                    <pl-dropdown-menu>
                        <pl-dropdown-option>第一个选项</pl-dropdown-option>
                        <pl-dropdown-option>第二个选项</pl-dropdown-option>
                        <pl-dropdown-option>第三个选项</pl-dropdown-option>
                    </pl-dropdown-menu>
                ))
            },
            useWithIcon(e) {
                this.$contextmenu(e.currentTarget, () => (
                    <pl-dropdown-menu>
                        <pl-dropdown-option label="新建 Create" onClick={() => this.$message('新建')} icon="el-icon-document-add"/>
                        <pl-dropdown-option label="编辑 Edit" onClick={() => this.$message('编辑')} disabled icon="el-icon-document"/>
                        <pl-dropdown-option label="删除 Delete" onClick={() => this.$message('删除')} icon="el-icon-document-remove"/>
                        <pl-dropdown-option label="导入 Import" onClick={() => this.$message('导入')} disabled icon="el-icon-download"/>
                        <pl-dropdown-option label="导出 Export" onClick={() => this.$message('导出')} icon="el-icon-upload1"/>
                        <pl-dropdown-option label="筛选 Filter" onClick={() => this.$message('筛选')} disabled icon="el-icon-crop"/>
                        <pl-dropdown-option label="排序 Sort" onClick={() => this.$message('排序')} icon="el-icon-s-fold"/>
                        <pl-dropdown-option label="多选 Select" onClick={() => this.$message('多选')} icon="el-icon-folder-opened"/>
                    </pl-dropdown-menu>
                ))
            },
        },
    }
</script>

<style lang="scss">

</style>