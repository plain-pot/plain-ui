<template>
    <div class="pl-base-table-body-item" :class="[`pl-base-table-body-item-${fixed}`]" :style="styles">
        <pl-scroll
                ref="scroll"
                :scroll-x="fixed === 'center'"
                :scroll-y="showNum!=null"
                :fit-height="showNum==null"
                :hide-scrollbar="fixed === 'left'"
                @scroll="e=>$emit('scroll',e)">
            <table cellspacing="0" cellpadding="0" border="0">
                <pl-base-table-row-space :body-columns="bodyColumns"/>
                <pl-base-table-row v-for="(item,index) in data"
                                   :key="item.id"
                                   :body-row-height="bodyRowHeight"
                                   :body-columns="bodyColumns"
                                   :fixed="fixed"
                                   :row-data="item"
                                   :index="index"
                                   :hover-index="hoverIndex"
                                   @click.native="$emit('click',{item,index})"
                                   @dblclick.native="$emit('dblclick',{item,index})"
                                   @mouseenter.native="$emit('mouseenter',{item,index})"
                />
            </table>
        </pl-scroll>
    </div>
</template>

<script>
    import {TableMixin} from "./index";
    import {MountedMixin} from "../../mixin/component-mixin";
    import PlBaseTableRow from "./pl-base-table-row";
    import PlBaseTableRowSpace from "./pl-base-table-row-space";

    export default {
        name: "pl-base-table-body-item",
        components: {PlBaseTableRowSpace, PlBaseTableRow},
        mixins: [TableMixin, MountedMixin],
        computed: {
            /*
             *  设置表格外层显示的宽度，比如左固定列表格的宽度就是左固定列宽度纸盒
             *  @author     martsforever
             *  @datetime   2019/1/6 21:51
             */
            width() {
                if (this.fixed === 'center') return null
                return this.bodyColumns.reduce((ret, item) => item.fixed === this.fixed ? ret + item.width : ret, 0)
            },
            styles() {
                if (!this.p_mounted) return null
                const styles = {}
                this.showNum != null && (styles.height = `${this.showNum * this.bodyRowHeight + 10}px`)
                styles.width = `${this.width}px`
                return styles
            },
        },
    }
</script>

<style lang="scss">
    .pl-base-table-body-item {
        & > .pl-scroll > .pl-scroll-content-wrapper > .pl-scroll-content {
            box-sizing: border-box;
            padding-bottom: 9px;
        }
    }
</style>