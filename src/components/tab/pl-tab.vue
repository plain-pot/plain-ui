<template>
    <li class="pl-tab" v-if="isShow">
        <slot v-if="init"></slot>
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
                init: false,
            }
        },
        computed: {
            tabId() {
                return this.val != null ? this.val : this.index
            },
            isShow() {
                const flag = this.tabId === this.plTabGroup.p_value

                if (!flag) return false
                else {
                    if (!this.init) {
                        this.$nextTick(() => this.init = true)
                        return false
                    } else {
                        return true
                    }
                }
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
                this.index = Array.from(this.$el.parentNode.childNodes).indexOf(this.$el)
            },
        },
    }
</script>

<style lang="scss">
</style>