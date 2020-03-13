<template>
    <div class="pl-form" :class="[`pl-form-column-${p_column || 1}`,`pl-form-size-${p_size || 'normal'}`]">
        <div class="pl-form-body" :style="bodyStyles">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import {EditMixin, PropsMixinFactory, StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-form",
        mixins: [
            EditMixin,
            StyleMixin,
            PropsMixinFactory({
                labelWidth: PropsMixinFactory.Number,
                contentWidth: PropsMixinFactory.Number,
                column: PropsMixinFactory.Number,
            })
        ],
        props: {
            column: {type: [String, Number], default: 1},           // 多列表单的列数
            labelWidth: {type: [String, Number]},                   // formItem 文本宽度
            contentWidth: {type: [String, Number]},                 // formItem 内容宽度
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
                maxLabelWidth: null,                                // 自动计算最大formItem文本宽度
            }
        },
        computed: {
            targetLabelWidth() {
                if (!!this.p_labelWidth) return this.p_labelWidth
                if (!!this.maxLabelWidth) return this.maxLabelWidth
                return null
            },
            targetContentWidth() {
                return this.p_contentWidth || 300
            },
            targetItemWidth() {
                if (!this.targetLabelWidth) return null
                if (!this.targetContentWidth) return null
                return this.targetLabelWidth + this.targetContentWidth
            },
            bodyStyles() {
                if (!this.targetItemWidth) return null
                return {
                    width: `${this.p_column * (this.targetItemWidth)}px`,
                    left: `${this.p_column === 1 ? -this.targetLabelWidth : 0}px`
                }
            },
            p_size() {
                if (!!this.size) return this.size
                if (!!this.plParentStyler && !!this.plParentStyler.p_size) return this.plParentStyler.p_size
                return this.p_column === 1 ? 'large' : null
            },
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            /*---------------------------------------handler-------------------------------------------*/
            addItem(formItem) {
                this.formItems.push(formItem)
                this.sortItems()

                if (this.p_labelWidth == null && formItem.labelEl) {
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