<template>
    <div class="test-list-draggier">
        <div class="list">
            <pl-scroll>
                <div class="item" v-for="item in state.data" :key="item.id">
                    <pl-button
                            @mousedown.native="handler.mousedown"
                            icon="el-icon-rank"
                            size="normal"
                            mode="text"
                            class="plc-draggier-handler"
                    />
                    {{item.id}}、
                    {{item.name}}
                </div>
            </pl-scroll>
        </div>
    </div>
</template>

<script>
    import {useListDraggier} from "../../../src/packages/table/plc-components/standard/draggier/use-list-draggier";
    import data from '../data/data-1'
    import {defineComponent, reactive} from "@vue/composition-api";
    import {$plain} from "../../../src/packages/base";

    export default defineComponent({
        name: "test-list-draggier",
        setup() {

            const state = reactive({
                data,
            })

            const {handler} = useListDraggier({
                rowClass: 'item',
                onChange: async (start, end) => {
                    /*console.log({
                        start, end
                    })*/
                    state.data.splice(end, 0, state.data.splice(start, 1)[0])
                }
            })
            return {
                state,
                handler,
            }
        },
    })
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