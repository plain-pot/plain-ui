<template>
    <div class="pl-base-table-cell" :style="styles">
        <template v-if="isFixed">
            <div class="pl-base-table-cell-content">
                <span>{{text}}</span>
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
            text: {},                               //没有有作用域渲染函数的时候显示的文本
            width: {},                              //单元格宽度
            height: {},                             //单元格高度
            isFixed: {default: false},              //是否为对应fixed table的cell
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