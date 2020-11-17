<template>
    <div class="demo-dropdown">
        <pl-dropdown trigger="hover">
            <pl-button>Dropdown</pl-button>
            <pl-dropdown-group>
                this is dropdown content
            </pl-dropdown-group>
        </pl-dropdown>
        旁边的文本(证明Dropdown为无根组件)
    </div>
</template>

<script>
    export default {
        name: "dropdown"
    }
</script>

<style lang="scss">

</style>