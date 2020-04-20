<template>
    <li class="pl-tab">
        <slot></slot>
    </li>
</template>

<script>
    export default {
        name: "pl-tab",
        inject: ['plTabGroup'],
        props: {
            title: {type: String},
            val: {},
        },
        data() {
            return {
                index: 0,
            }
        },
        computed: {
            tabId() {
                return this.val != null ? this.val : this.index
            },
        },
        created() {
            this.plTabGroup.addItem(this)
        },
        beforeDestroy() {
            this.plTabGroup.removeItem(this)
        },
        methods: {
            /*---------------------------------------utils-------------------------------------------*/
            async refreshIndex() {
                await this.$plain.nextTick()
                // @ts-ignore
                this.index = Array.from(this.$el.parentNode.childNodes).filter(item => item.nodeName !== '#comment' && (!item.style || item.style.display !== 'none')).indexOf(this.$el) + 1
            },
        },
    }
</script>

<style lang="scss">
</style>