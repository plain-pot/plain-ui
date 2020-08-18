<template>
    <div class="test-list-draggier">
        <div class="list">
            <div class="item" v-for="item in state.data" :key="item.id" @mousedown="handler.onMousedownDraggier">
                <pl-button
                        icon="el-icon-rank"
                        size="normal"
                        mode="text"
                        class="plc-draggier-handler"
                />
                {{item.name}}
            </div>
        </div>
    </div>
</template>

<script>
    import {useListDraggier} from "../../../src/packages/table/plc-components/standard/draggier/use-list-draggier";
    import data from '../data/data-1'
    import {reactive} from "@vue/composition-api";

    export default {
        name: "test-list-draggier",
        setup() {

            const state = reactive({
                data,
            })

            const {handler} = useListDraggier({
                rowClass: 'item'
            })

            return {
                state,
                handler,
            }
        },
    }
</script>

<style lang="scss">

    .test-list-draggier {
        .list {
            height: 400px;
            overflow: auto;

            .item {
                height: 40px;
                border-bottom: solid 1px #f2f2f2;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                background: white;
            }
        }
    }

</style>