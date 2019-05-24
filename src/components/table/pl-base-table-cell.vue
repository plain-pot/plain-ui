<template>
    <div class="pl-base-table-cell" :style="styles">
        <template v-if="isFixed">
            <div class="pl-base-table-cell-content">
                <span v-if="!data">{{showText}}</span>
                <edit-content v-else-if="!data.editable" :scope-slot-func="defaultScopedSlots" :render-func="defaultRenderFunc" :data="p_data" :text="showText" key="edit"/>
                <edit-content v-else :scope-slot-func="editScopedSlots" :render-func="editRenderFunc" :data="p_data" :text="showText" key="normal"/>
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

    const EditContent = {
        components: {PlRenderFunc, PlScopeSlot},
        props: {
            scopeSlotFunc: {},
            renderFunc: {},
            data: {},
            text: {},
        },
        render() {
            return (
                <div className="pl-base-table-cell-content">
                    {!!this.scopeSlotFunc && <pl-scope-slot scope-slot-func={this.scopeSlotFunc} data={this.data}/>}
                    {!!this.renderFunc && <pl-render-func render-func={this.renderFunc} data={this.data}/>}
                    {!this.scopeSlotFunc && !this.renderFunc && <span>{this.text}</span>}
                </div>
            )
        },
    }

    export default {
        name: "pl-base-table-cell",
        components: {PlTooltipText, PlRenderFunc, PlScopeSlot, EditContent},
        mixins: [TableMixin],
        props: {
            text: {},                               //没有有作用域渲染函数的时候显示的文本
            width: {},                              //单元格宽度
            height: {},                             //单元格高度
            isFixed: {default: false},              //是否为对应fixed table的cell
            data: {},
            index: {},
            col: {},
            colIndex: {},

            editScopedSlots: {type: Function},      //作用域插槽：编辑
            defaultScopedSlots: {type: Function},   //作用域插槽：正常

            editRenderFunc: {type: Function},       //渲染函数：编辑
            defaultRenderFunc: {type: Function},    //渲染函数：正常
        },
        data() {
            return {
                p_text: this.text,
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
            showRow() {
                if (!this.data) return {}
                return this.data.editable ? this.data.editRow : this.data.row
            },
            showText() {
                if (!!this.p_text) return this.p_text
                return this.showRow[this.col.field]
            },
            p_data() {
                return {
                    ...(this.data || {}),
                    col: this.col,
                    colIndex: this.colIndex,
                    showRow: this.showRow,
                    text: this.showText,
                    rowIndex: this.index,
                    prop: this.col.propData
                }
            },
        },
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

    .pl-base-table-body {
        .pl-base-table-cell {
            border-bottom: solid 1px #f2f2f2;
        }
    }
</style>