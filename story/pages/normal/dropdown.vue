<template>
    <div class="demo-dropdown">
        <demo-row>
            <pl-dropdown>
                <pl-button>Dropdown</pl-button>
                <pl-dropdown-menu>
                    <pl-dropdown-option label="组件按需引入"/>
                    <pl-dropdown-option label="图标按需加载"/>
                    <pl-dropdown-option label="虚拟滚动列表"/>
                </pl-dropdown-menu>
            </pl-dropdown>
            旁边的文本(证明Dropdown为无根组件)
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