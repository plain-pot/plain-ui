<template>
    <div class="demo-use-event">
        <div>
            当前滚动位置:{{!!state.currentPart?`${state.currentPart} (${state.count})`:'无'}}
        </div>
        <h3>
            <input type="checkbox" id="showHeader" v-model="state.showHeader">
            <label for="showHeader">showHeader</label>
        </h3>
        <demo-use-event-table @scroll="onScroll" :showHeader="state.showHeader"/>
    </div>
</template>

<script>
    import {DemoUseEventTable} from "./DemoUseEventTable";
    import {reactive} from 'vue'

    export default {
        name: "demo-use-event",
        components: {
            DemoUseEventTable
        },
        setup() {
            const state = reactive({
                showHeader: true,
                currentPart: null,
                count: 0,
            })

            return {
                state,
                onScroll: (e, part) => {
                    if (part === state.currentPart) {
                        state.count++
                    } else {
                        state.currentPart = part
                        state.count = 0
                    }
                }
            }
        },
    }
</script>

<style lang="scss">
    .demo-use-event-table {
        width: 300px;

        .demo-use-event-table-head {
            width: 100%;
            overflow-x: auto;

            .demo-use-event-table-head-inner {
                width: 600px;
                height: 60px;
                background-color: #f6f6f6;
                font-size: 50px;
            }
        }

        .demo-use-event-table-body {
            width: 100%;
            overflow-x: auto;
            height: 300px;

            .demo-use-event-table-body-inner {
                width: 600px;
                height: 600px;
                background-color: #f2f2f2;
                font-size: 120px;
            }
        }
    }
</style>