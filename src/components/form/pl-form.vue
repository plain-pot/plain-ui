<template>
    <div class="pl-form">
        <slot></slot>
    </div>
</template>

<script>
    import {EditMixin, PropsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-form",
        mixins: [
            EditMixin,
            PropsMixinFactory({
                labelWidth: PropsMixinFactory.Number,
            })
        ],
        props: {
            labelWidth: {type: [String, Number]},                   // formItem 文本宽度
            disabledFields: {type: Object},                         // 禁用的字段
            readonlyFields: {type: Object},                         // 只读的字段
        },
        provide() {
            return {
                plForm: this,
            }
        },
        data() {
            return {
                formItems: [],
                maxLabelWidth: null,
            }
        },
        computed: {
            targetLabelWidth() {
                if (!!this.maxLabelWidth) return this.maxLabelWidth
                return this.p_labelWidth
            },
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            /*---------------------------------------handler-------------------------------------------*/
            addItem(formItem) {
                this.formItems.push(formItem)
                this.sortItems()

                if (this.p_labelWidth == null) {
                    const labelWidth = formItem.labelEl.offsetWidth
                    if (!this.maxLabelWidth || this.maxLabelWidth < labelWidth) {
                        this.maxLabelWidth = labelWidth
                    }
                }
            },
            removeItem(formItem) {
                const index = this.formItems.indexOf(formItem)
                if (index > -1) {
                    this.formItems.splice(index, 1)
                    this.sortItems()
                }
            },
            sortItems() {

            },
        },
    }
</script>

<style lang="scss">
</style>