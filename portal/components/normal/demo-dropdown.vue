<template>
    <div class="demo-dropdown">
        <im-demo-row title="基本用法">
            <im-dropdown>
                <im-button label="toggle"/>
                <template slot="popper">
                    <im-dropdown-item label="北京"/>
                    <im-dropdown-item label="上海"/>
                    <im-dropdown-item label="广州"/>
                </template>
            </im-dropdown>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-dropdown"
    }
</script>

<style lang="scss">
    .demo-dropdown {
        @at-root .demo-dropdown-box {
            width: 200px;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>