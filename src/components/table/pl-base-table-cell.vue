<template>
    <div class="pl-base-table-cell" :style="styles">
        <template v-if="isFixed">
            <div class="pl-base-table-cell-content">
                <keep-alive>
                    <template v-if="!!p_editing">
                        <pl-scope-slot v-if="editScopedSlots" :scope-slot-func="editScopedSlots" :data="p_data"/>
                        <pl-render-func v-else-if="editRenderFunc" :render-func="editRenderFunc" :data="p_data"/>
                        <span v-else>{{text}}</span>
                    </template>
                    <template v-else>
                        <pl-scope-slot v-if="defaultScopedSlots" :scope-slot-func="defaultScopedSlots" :data="p_data"/>
                        <pl-render-func v-else-if="defaultRenderFunc" :render-func="defaultRenderFunc" :data="p_data"/>
                        <span v-else>{{text}}</span>
                    </template>
                </keep-alive>
            </div>
            <div class="pl-base-table-cell-content-slot">
                <slot></slot>
            </div>
        </template>
    </div>
</template>

<script>
    import PlScopeSlot from "../render/pl-scope-slot";
    import {TableMixin} from "./index";
    import PlRenderFunc from "../render/pl-render-func";
    import PlTooltipText from "../pl-tooltip-text";

    export default {
        name: "pl-base-table-cell",
        components: {PlTooltipText, PlRenderFunc, PlScopeSlot},
        mixins: [TableMixin],
        props: {
            data: {},                               //作用域渲染函数渲染的数据
            text: {},                               //没有有作用域渲染函数的时候显示的文本
            width: {},                              //单元格宽度
            height: {},                             //单元格高度
            isFixed: {default: false},              //是否为对应fixed table的cell
            editing: {},                            //当前是否为编辑状态
            col: {},                                //列信息数据
            row: {},                                //渲染的行数据，如果是渲染表头，则该属性不存在

            editScopedSlots: {type: Function},      //作用域插槽：编辑
            defaultScopedSlots: {type: Function},   //作用域插槽：正常

            editRenderFunc: {type: Function},       //渲染函数：编辑
            defaultRenderFunc: {type: Function},    //渲染函数：正常
        },
        data() {
            return {
                p_text: this.text,
                p_timer: null,
            }
        },
        watch: {
            text: {
                immediate: true,
                handler(val) {
                    if (!this.col.formatter && !this.col.dataType) {
                        this.p_text = val
                        return
                    }
                    if (!!this.p_timer) {
                        clearTimeout(this.p_timer)
                        this.p_timer = null
                    }
                    this.p_timer = setTimeout(async () => {
                        if (!!this.col.formatter) {
                            this.p_text = await this.col.formatter(val, this.data)
                            return
                        }
                        if (!!this.col.dataType) {
                            const map = {tel: 'telFormat', money: 'moneyFormat', cny: 'cnyFormat', percent: 'percentNumFormat',}
                            if (Object.keys(map).indexOf(this.col.dataType) === -1) return Promise.reject("dataType is invalid:" + this.col.dataType)
                            this.p_text = this.$plain.$utils[map[this.col.dataType]](val)
                        }
                    }, 300)
                },
            }
        },
        computed: {
            styles() {
                const styles = {
                    height: this.$plain.$utils.unit(this.height),
                    width: this.$plain.$utils.unit(this.width),
                }
                return styles
            },
            p_editing() {
                if (this.data.rowIndex == null && this.data.colIndex == null) return
                const editable = this.editing && this.data.col.editable
                return editable && (!this.data.col.editableFunc || this.data.col.editableFunc(this.data))
            },
            p_data() {
                return {
                    ...this.data,
                    text: this.p_text
                }
            },
        },
        methods: {}
    }
</script>

<style lang="scss">
    .pl-base-table-cell {
        display: inline-flex;
        box-sizing: border-box;
        padding: 0 6px;

        .pl-base-table-cell-content {
            flex: 1;
            display: flex;
            align-items: center;
        }

        .pl-base-table-cell-content-slot {
            display: flex;
            align-items: center;
        }
    }
</style>