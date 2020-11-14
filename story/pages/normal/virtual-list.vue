<template>
    <div class="demo-virtual-list">
        <demo-row title="基本用法">
            <div class="demo-virtual-list-container">
                <pl-virtual-list :data="list" :size="40">
                    <template v-slot="{item,index}">
                        <div :key="index" :style="{backgroundColor:item.color,height: '40px'}" class="demo-virtual-list-item" :vid="index" @click="$plain.log(index,{...item})">
                            <div class="seq">
                                {{index}}
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
                    </template>
                </pl-virtual-list>
            </div>
        </demo-row>
        <demo-row title="动态高度">
            <div class="demo-virtual-list-container">
                <pl-virtual-list :data="list" :size="60" dynamicSize ref="list">
                    <template v-slot="{item,index}">
                        <div :style="{backgroundColor:item.color,height:`${item.size}px`}" :key="index" class="demo-virtual-list-item" :vid="index" @click="onClick(item,index)">
                            <div class="seq">
                                {{index}}
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
                    </template>
                </pl-virtual-list>
            </div>
        </demo-row>

        <demo-row title="禁用虚拟滚动">
            <pl-checkbox v-model="disabledVirtualScroll" label="禁用虚拟滚动"/>
            <div class="demo-virtual-list-container">
                <pl-virtual-list :data="data2" :size="40" :disabled="disabledVirtualScroll">
                    <template v-slot="{item,index}">
                        <div :style="{backgroundColor:item.color,height: '40px'}" :key="index" class="demo-virtual-list-item" :vid="index" @click="$plain.log(index,{...item})">
                            <div class="seq">
                                {{index}}
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
                    </template>
                </pl-virtual-list>
            </div>
        </demo-row>
    </div>
</template>

<script>

    import data from '../data/data.json'
    import data2 from '../data/data-2'

    console.log(data2.length)

    export default {
        name: "demo-virtual-list",
        props: {},
        data() {
            return {
                list: data,
                data2,
                disabledVirtualScroll: false,
            }
        },
        methods: {
            onClick(item, index) {
                // this.$plain.log(index, {...item})
                console.log(this.$refs.list.adjust)
            },
        },
        mounted() {
            /*window.totalHeight = data.reduce((ret, item) => ret + item.size, 0)
            console.log('total height', window.totalHeight)*/
        }
    }
</script>

<style lang="scss">
    .demo-virtual-list-container {
        width: 300px;
        height: 400px;
        background-color: #f6f6f6;

        .demo-virtual-list-item {
            display: block;
            width: 100%;
            height: 40px;

            .seq {
                width: 40px;
                background-color: rgba(0, 0, 0, 0.5);
                color: white;
                height: 100%;
                overflow: hidden;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }

            .content {
                width: calc(100% - 40px);
                float: right;
                height: 100%;
                padding: 0 12px;
                display: flex;
                justify-content: center;
                flex-direction: column;
                box-sizing: border-box;

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