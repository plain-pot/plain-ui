<template>
    <div class="demo-use-event">
        <div style="display: inline-block;width: 360px">
            <div>
                当前滚动位置:{{!!state.currentPart?`${state.currentPart} (${state.count})`:'无'}}
            </div>
            <h3>
                <input type="checkbox" id="showHeader" v-model="state.showHeader">
                <label for="showHeader">showHeader</label>
            </h3>
            <demo-use-event-table @scroll="onScroll" :showHeader="state.showHeader"/>
        </div>
        <ul style="display: inline-block; vertical-align: top">
            <li v-for="item in state.tips" :key="item.label">
                <button v-if="!item.done" style="margin-right: 8px" @click="()=>item.done = true">done</button>
                <span>{{item.label}}</span>
            </li>
        </ul>
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

                tips: [
                    {label: '使用鼠标的滚轮进行纵向滚动', done: false},
                    {label: '拖拽横向滚动条横向联动滚动', done: false},
                    {label: '在表头、表体使用触摸板横向，以及纵向滚动', done: false},
                    {label: '在表头使用鼠标滚动横向滚动', done: false},
                    {label: '在表体使用 alt+鼠标滚动 横向滚动', done: false},
                ],
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
                font-size: 40px;
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