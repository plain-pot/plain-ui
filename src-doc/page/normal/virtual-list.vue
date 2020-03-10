<template>
    <div class="demo-virtual-list">
        <demo-row title="基本用法">
            <div class="demo-virtual-list-container">
                <pl-virtual-list :data="list" :size="40" :remain="10">
                    <div slot-scope="{item,index}" :style="{backgroundColor:item.color}" class="demo-virtual-list-item">
                        <div class="seq">
                            {{item.id}}
                        </div>
                        <div class="content">
                            <div class="label">
                                <span>{{item.name}}</span>
                                <span>{{item.date}}</span>
                            </div>
                            <div class="star">
                                {{item.star}}
                            </div>
                        </div>
                    </div>
                </pl-virtual-list>
            </div>
        </demo-row>
    </div>
</template>

<script>

    import {mock} from 'mockjs'

    export default {
        name: "demo-virtual-list",
        props: {},
        data() {

            const list = []
            const length = 100

            list.push(...(mock({
                [`array|${length}`]: [
                    {
                        "id|+1": 0,
                        color: '@color',
                        name: '@first',
                        date: '@date',
                        "star|1-10": '★',
                    }
                ]
            })).array)

            return {
                list,
            }
        },
        methods: {},
        mounted() {

        }
    }
</script>

<style lang="scss">
    .demo-virtual-list-container {
        width: 300px;
        height: 400px;
        background-color: #f6f6f6;

        .demo-virtual-list-item {
            display: inline-block;
            width: 100%;
            height: 40px;

            .seq {
                display: inline-block;
                width: 40px;
                background-color: rgba(0, 0, 0, 0.5);
                color: white;
                height: 100%;
                text-align: center;
                line-height: 40px;
            }

            .content {
                width: calc(100% - 40px);
                float: right;
                height: 100%;
                padding: 0 12px;
                .label {
                    font-size: 12px;
                    display: flex;
                    justify-content: space-between;
                }

                .star {
                    text-align: right;
                    color: white;
                }
            }
        }
    }
</style>