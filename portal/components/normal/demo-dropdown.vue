<template>
    <div class="demo-dropdown">
        <im-demo-row title="基本用法">
            <im-dropdown>
                <im-button label="toggle"/>
                <div slot="popper" class="demo-dropdown-box">
                    this is dropdown content
                </div>
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