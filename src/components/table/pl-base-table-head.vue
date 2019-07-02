<template>
    <div class="pl-base-table-head" :style="styles">
        <pl-scroll :scroll-y="false" :scroll-x="true" hide-scrollbar class="pl-base-table-head-scroll" ref="scroll" @scroll="e=>$emit('scroll',e)">
            <pl-base-table-head-item fixed="center"
                                     :head-columns="headColumns"
                                     :body-columns="bodyColumns"
                                     :sort-field="sortField"
                                     :sort-desc="sortDesc"
                                     :head-row-height="headRowHeight"
                                     :body-row-height="bodyRowHeight"
                                     :fixed-row-data="fixedRowData"/>
        </pl-scroll>
        <pl-base-table-head-item fixed="left"
                                 v-if="fixedExist.left"
                                 :head-columns="headColumns"
                                 :body-columns="bodyColumns"
                                 :sort-field="sortField"
                                 :sort-desc="sortDesc"
                                 :head-row-height="headRowHeight"
                                 :body-row-height="bodyRowHeight"
                                 :fixed-row-data="fixedRowData"/>
        <pl-base-table-head-item fixed="right"
                                 v-if="fixedExist.right"
                                 :head-columns="headColumns"
                                 :body-columns="bodyColumns"
                                 :sort-field="sortField"
                                 :sort-desc="sortDesc"
                                 :head-row-height="headRowHeight"
                                 :body-row-height="bodyRowHeight"
                                 :fixed-row-data="fixedRowData"/>
    </div>
</template>

<script>
    import {TableMixin} from "./index";
    import PlBaseTableHeadItem from "./pl-base-table-head-item";
    import PlScroll from "../pl-scroll";

    export default {
        name: "pl-base-table-head",
        components: {PlScroll, PlBaseTableHeadItem},
        mixins: [TableMixin],
        computed: {
            styles() {
                let height = this.headColumns.length * this.headRowHeight
                if (!!this.fixedRowData && this.fixedRowData.length > 0) {
                    height = height + this.fixedRowData.length * this.bodyRowHeight
                }
                return {
                    height: `${height}px`
                }
            },
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-base-table-head {
            position: relative;
            overflow: hidden;
            border-bottom: solid 1px plVar(colorBorder);

            table {
                font-size: 12px;
                color: #282f4a;
            }
        }
    }
</style>