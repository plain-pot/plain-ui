<template>
    <div class="pl-base-table-head" :style="styles">
        <pl-scroll :scroll-y="false" :scroll-x="true" hide-scrollbar class="pl-base-table-head-scroll" ref="scroll" @scroll="e=>$emit('scroll',e)">
            <pl-base-table-head-item fixed="center"
                                     :head-columns="headColumns"
                                     :body-columns="bodyColumns"
                                     :sort-field="sortField"
                                     :sort-desc="sortDesc"
                                     :head-row-height="headRowHeight"/>
        </pl-scroll>
        <pl-base-table-head-item fixed="left"
                                 v-if="fixedExist.left"
                                 :head-columns="headColumns"
                                 :body-columns="bodyColumns"
                                 :sort-field="sortField"
                                 :sort-desc="sortDesc"
                                 :head-row-height="headRowHeight"/>
        <pl-base-table-head-item fixed="right"
                                 v-if="fixedExist.right"
                                 :head-columns="headColumns"
                                 :body-columns="bodyColumns"
                                 :sort-field="sortField"
                                 :sort-desc="sortDesc"
                                 :head-row-height="headRowHeight"/>
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
                return {
                    height: `${this.headColumns.length * this.headRowHeight}px`
                }
            },
        },
    }
</script>

<style lang="scss">
    .pl-base-table-head {
        position: relative;
        overflow: hidden;

    }
</style>