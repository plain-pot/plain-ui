<template>
    <pl-scroll class="pl-virtual-list">
        <template v-for="(item,index) in renderData">
            <slot :item="item" :index="index"></slot>
        </template>
    </pl-scroll>
</template>

<script>
    export default {
        name: "pl-virtual-list",
        props: {
            data: {type: Array, require: true},
            size: {type: Number, require: true},
            remain: {type: Number},
        },
        data() {
            return {}
        },
        computed: {
            renderData() {
                return this.data || []
            },
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>