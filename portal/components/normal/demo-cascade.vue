<template>
    <div class="demo-cascade">
        <im-demo-row title="基本用法">
            <im-cascade :data="cascadeData" label-key="label" children-key="children" value-key="value"/>
        </im-demo-row>
        <im-demo-row title="只显示最后一级数据">
            <im-cascade :data="cascadeData" label-key="label" children-key="children" value-key="value" :show-all-levels="false"/>
        </im-demo-row>
        <im-demo-row title="禁用选项">
            <im-cascade :data="cascadeData" label-key="label" children-key="children" value-key="value" disabled-key="disabled"/>
        </im-demo-row>
        <im-demo-row title="选中的时候就改变数据，而不是选择最后一级数据的时候才改变数据">
            <im-cascade :data="cascadeData" label-key="label" children-key="children" value-key="value" changeOnSelect/>
        </im-demo-row>
        <im-demo-row title="动态加载数据">
            <im-cascade :data="cascadeData" label-key="label" children-key="children" value-key="value" :loadDataFunc="loadDataFunc"/>
        </im-demo-row>
        <im-demo-row title="自定义渲染内容">
            <im-cascade :data="cascadeData" label-key="label" children-key="children" value-key="value">
                <template slot-scope="{item}">
                    <div class="demo-cascade-box">
                        <div>{{item.label}}</div>
                        <div>{{item.value}}</div>
                    </div>
                </template>
            </im-cascade>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-cascade",
        data() {
            return {
                count: 0,
                cascadeData: [{
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            disabled: true,
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        },
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        },
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        },
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        },
                    ]
                }, {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                }
                            ]
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                }
                            ]
                        }
                    ],
                }]
            }
        },
        methods: {
            loadDataFunc(data) {
                console.log('loadDataFunc-->>', this.count)
                return [
                    {value: `zone-${this.count++}`, label: `${data.label}-${this.count++}`},
                    {value: `zone-${this.count++}`, label: `${data.label}-${this.count++}`},
                    {value: `zone-${this.count++}`, label: `${data.label}-${this.count++}`},
                ]
            },
        }
    }
</script>

<style lang="scss">
    .demo-cascade-box {
        & > div:nth-child(2) {
            font-size: 12px;
            color: #999;
        }
    }
</style>