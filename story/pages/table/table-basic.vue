<template>
    <div class="table-basic">
        <demo-row title="基础用法">
            <pl-form column="1">
                <pl-form-item label="列宽度响应测试">
                    <pl-number v-model="plc.width" :step="100"/>
                </pl-form-item>
                <pl-form-item label="表头行高">
                    <pl-number v-model="props.headRowHeight" :step="5"/>
                </pl-form-item>
                <pl-form-item label="表体行高">
                    <pl-number v-model="props.bodyRowHeight" :step="5"/>
                </pl-form-item>
                <pl-form-item label="列销毁测试">
                    <pl-toggle v-model="plc.init"/>
                </pl-form-item>
                <pl-form-item label="文本对齐方式">
                    <pl-radio-group v-model="plc.align">
                        <pl-radio label="left" val="left"/>
                        <pl-radio label="center" val="center"/>
                        <pl-radio label="right" val="right"/>
                    </pl-radio-group>
                </pl-form-item>
                <pl-form-item label="带边框">
                    <pl-checkbox v-model="props.border"/>
                </pl-form-item>
                <pl-form-item label="合计行">
                    <pl-toggle v-model="other.hasSummaryData"/>
                </pl-form-item>
                <pl-form-item label="表头分组">
                    <pl-toggle v-model="other.groupHead"/>
                </pl-form-item>
                <pl-form-item label="启用虚拟滚动">
                    <pl-toggle v-model="props.virtual"/>
                </pl-form-item>
                <template v-if="!other.groupHead">
                    <pl-form-item label="order(大小)">
                        <pl-number v-model="plc.order"/>
                    </pl-form-item>
                    <pl-form-item label="hide:(评分)">
                        <pl-toggle v-model="plc.hide"/>
                    </pl-form-item>
                </template>
            </pl-form>
            <div style="margin-right: 0">
                <pl-table :data="tableData"
                          :summaryData="other.hasSummaryData?summaryData:null"
                          @dblclick-cell="onDblclickCell"
                          v-bind="props">
                    <template v-if="other.groupHead">
                        <plc-input title="输入框列" field="id" required/>
                        <plc-input title="输入框列" field="id"/>

                        <plc-toggle title="开关" field="toggleFlag" :align="plc.align">
                            <template #head>
                                [head]
                            </template>
                            <template #summary>
                                summary
                            </template>
                        </plc-toggle>

                        <plc field="id" title="编号" :width="plc.width" :align="plc.align"/>
                        <plc field="id" title="编号" :align="plc.align">
                            <template #head>
                                <span>自定义表头</span>
                                <pl-icon icon="el-icon-warning" v-tooltip="'tips'"/>
                            </template>
                            <template v-slot:default="{rowData}">
                                [{{rowData.data.star}}]
                            </template>
                            <template v-slot:summamry="{rowData}">
                                -[{{rowData.data.star}}]-
                            </template>
                        </plc>
                        <plc field="size" title="大小" :align="plc.align"/>
                        <plc-group title="地址" :align="plc.align">
                            <plc field="date" title="日期" :align="plc.align"/>
                            <plc-list>
                                <plc field="color" title="颜色" :align="plc.align"/>
                                <plc field="name" title="名称" v-if="plc.init" :align="plc.align"/>
                            </plc-list>
                        </plc-group>
                        <plc field="star" title="评分" :align="plc.align"/>
                    </template>
                    <template v-else>
                        <plc field="id" title="编号" :order="4"/>
                        <plc field="size" title="大小" :width="plc.width" :order="plc.order"/>
                        <plc field="date" title="日期" :order="6"/>
                        <plc field="color" title="颜色"/>
                        <plc field="name" title="名称" v-if="plc.init"/>
                        <plc field="star" title="评分" :hide="plc.hide"/>
                    </template>
                </pl-table>
            </div>
        </demo-row>
    </div>
</template>

<script>
    import data from "../data/data-1.json";

    export default {
        name: "table-basic",
        data() {
            return {
                tableData: data,
                summaryData: [
                    {
                        "id": 0,
                        "color": "#79f285",
                        "name": "Lisa",
                        "date": "2002-04-28",
                        "star": "★★★★★★★",
                        "size": 49
                    },
                    {
                        "id": 1,
                        "color": "#f27990",
                        "name": "George",
                        "date": "2019-01-06",
                        "star": "★★★★★★★★",
                        "size": 74
                    },
                ],

                other: {
                    hasSummaryData: true,
                    groupHead: true,
                },
                props: {
                    headRowHeight: 45,
                    bodyRowHeight: 40,
                    border: false,
                    virtual: false,
                },
                plc: {
                    width: 200,
                    align: 'left',
                    init: true,
                    order: 5,
                },
                editNode: null,
                onDblclickCell: (node) => {

                    console.log('node', node)

                    if (!!this.editNode) {
                        if (node === this.editNode) {
                            node.saveEdit()
                            node.closeEdit()
                            this.editNode = null
                            return
                        } else {
                            this.editNode.cancelEdit()
                        }
                    }

                    node.enableEdit()
                    this.editNode = node
                },
            }
        },
    }
</script>

<style lang="scss">
    .table-basic {
    }
</style>