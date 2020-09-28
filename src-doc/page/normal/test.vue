<template>
    <div style="padding: 20px 0;">
        <pl-button>FIRST BUTTON</pl-button>
        <pl-button ref="btn">BUTTON</pl-button>
    </div>
</template>

<script>

    import TestTable from './test-table/test-table'
    import {PlainTooltip} from "../../../submodules/plain-popper/PlainTooltip";

    export default {
        name: "test",
        components: {
            TestTable,
        },
        data() {
            return {}
        },
        mounted() {
            const tooltip = new PlainTooltip({
                reference: this.$refs.btn.$el,
                content: '一段提示文本',
                // trigger: 'hover',
                // theme: 'light',
                // animate: 'drop',
                // placement:'bottom',
            })
        }
    }
</script>

<style lang="scss">
</style>