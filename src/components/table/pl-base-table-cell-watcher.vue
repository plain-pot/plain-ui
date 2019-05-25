<template>
    <div class="pl-base-table-cell-watcher">
        <pl-scope-slot v-if="!!scopeSlotFunc" :scope-slot-func="scopeSlotFunc" :data="data"/>
        <pl-render-func v-else-if="renderFunc" :render-func="renderFunc" :data="data"/>
        <span v-else>{{text}}</span>
    </div>
</template>

<script>
    import PlScopeSlot from "../render/pl-scope-slot";
    import PlRenderFunc from "../render/pl-render-func";

    export default {
        name: "pl-base-table-cell-watcher",
        components: {PlRenderFunc, PlScopeSlot},
        props: {
            scopeSlotFunc: {},
            renderFunc: {},
            data: {},
            text: {},
        },
    }
</script>

<style lang="scss">

</style>