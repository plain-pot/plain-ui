<template>
    <div class="demo-dropdown">
        <demo-row title="基本用法">
            <pl-dropdown>
                <pl-button>Dropdown</pl-button>
                <template #popper>
                    <pl-dropdown-menu>
                        <pl-dropdown-option label="新建 Create" @click="$message('新建')"/>
                        <pl-dropdown-option label="编辑 Edit" @click="$message('编辑')"/>
                        <pl-dropdown-option label="删除 Delete" @click="$message('删除')"/>
                        <pl-dropdown-option label="导入 Import" @click="$message('导入')"/>
                        <pl-dropdown-option label="导出 Export" @click="$message('导出')"/>
                        <pl-dropdown-option label="筛选 Filter" @click="$message('筛选')"/>
                        <pl-dropdown-option label="排序 Sort" @click="$message('排序')"/>
                        <pl-dropdown-option label="多选 Select" @click="$message('多选')"/>
                    </pl-dropdown-menu>
                </template>
            </pl-dropdown>
            旁边的文本(证明Dropdown为无根组件)
        </demo-row>
        <demo-row title="宽高设置">
            <pl-dropdown height="150">
                <pl-button>Dropdown</pl-button>
                <template #popper>
                    <pl-dropdown-menu>
                        <pl-dropdown-option label="新建 Create" @click="$message('新建')"/>
                        <pl-dropdown-option label="编辑 Edit" @click="$message('编辑')"/>
                        <pl-dropdown-option label="删除 Delete" @click="$message('删除')"/>
                        <pl-dropdown-option label="导入 Import" @click="$message('导入')"/>
                        <pl-dropdown-option label="导出 Export" @click="$message('导出')"/>
                        <pl-dropdown-option label="筛选 Filter" @click="$message('筛选')"/>
                        <pl-dropdown-option label="排序 Sort" @click="$message('排序')"/>
                        <pl-dropdown-option label="多选 Select" @click="$message('多选')"/>
                    </pl-dropdown-menu>
                </template>
            </pl-dropdown>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "dropdown"
    }
</script>

<style lang="scss">

</style>