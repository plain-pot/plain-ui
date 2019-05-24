<template>
    <div class="pl-base-table-head" :style="styles">
        <pl-scroll :scroll-y="false" :scroll-x="true" hide-scrollbar class="pl-base-table-head-scroll" ref="scroll" @scroll="e=>$emit('scroll',e)">
            <pl-base-table-head-item :head-columns="headColumns" :body-columns="bodyColumns" fixed="center" :sort-field="sortField" :sort-desc="sortDesc" :head-row-height="headRowHeight"/>
        </pl-scroll>
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