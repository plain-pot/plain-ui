<template>
    <div class="pl-base-table-body">
        <pl-base-table-body-item
                v-for="(fixed) in fixeds"
                :key="fixed"
                :ref="fixed"
                :fixed="fixed"

                :body-columns="bodyColumns"
                :data="data"
                :body-row-height="bodyRowHeight"
                :show-num="showNum"
        />
    </div>
</template>

<script>
    import {TableMixin} from "./index";
    import PlBaseTableBodyItem from "./pl-base-table-body-item";

    export default {
        name: "pl-base-table-body",
        components: {PlBaseTableBodyItem},
        mixins: [
            TableMixin,
        ],
        data() {
            return {
                fixeds: ['center', 'left', 'right'],                                        //固定列位置，用于循环
                p_hoverFixed: null,                                                        //当前鼠标hover的位置：center、left、right，用于判断滚动
                p_calculateTimer: null,                                                    //计算左右滚动的计时器
                baseTable: null,                                                            //baseTable父对象
            }
        },

    }
</script>

<style lang="scss">
    .pl-base-table-body {
        position: relative;

        .pl-base-table-body-item {
            background-color: white;
        }

        .pl-base-table-body-item-left, .pl-base-table-body-item-right {
            position: absolute;
            top: 0;
        }
        .pl-base-table-body-item-right {
            right: 0;
            .pl-scroll-content-wrapper {
                position: relative;
                .pl-scroll-content {
                    right: 0;
                    position: absolute;
                    float: right;
                    table {
                        float: right;
                    }
                }
            }
        }
    }
</style>