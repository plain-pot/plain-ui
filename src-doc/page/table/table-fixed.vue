<template>
    <div class="table-fixed">
        <pl-form column="3">
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
                <pl-form-item label="order">
                    <pl-number v-model="plc.order"/>
                </pl-form-item>
                <pl-form-item label="hide">
                    <pl-toggle v-model="plc.hide"/>
                </pl-form-item>
            </template>
        </pl-form>
        <demo-row title="固定列">
            <pl-table  :data="tableData"
                       :summaryData="other.hasSummaryData?summaryData:null"
                       v-bind="props">

                <template v-if="other.groupHead">
                    <plc field="id" title="编号" fixed="left"/>
                    <plc-group title="GROUP1" autoFixedLeft>
                        <plc field="id" title="编号"/>
                        <plc field="size" title="大小"/>
                        <plc-group title="地址">
                            <plc field="date" title="日期"/>
                            <plc field="color" title="颜色"/>
                        </plc-group>
                        <plc field="name" title="名称"/>
                        <plc field="star" title="评分"/>
                    </plc-group>
                    <plc field="star" title="评分" fixed="right"/>
                    <plc-group title="GROUP2">
                        <plc field="size" title="大小"/>
                        <plc field="date" title="日期"/>
                        <plc field="color" title="颜色"/>
                        <plc field="name" title="名称"/>
                    </plc-group>
                    <plc-group title="GROUP3">
                        <plc field="size" title="大小"/>
                        <plc field="date" title="日期"/>
                        <plc field="color" title="颜色"/>
                        <plc field="name" title="名称"/>
                    </plc-group>
                    <plc-group title="GROUP4">
                        <plc field="size" title="大小"/>
                        <plc field="date" title="日期"/>
                        <plc field="color" title="颜色"/>
                        <plc field="name" title="名称"/>
                    </plc-group>
                </template>

                <template v-else>
                    <plc field="id" title="编号" fixed="left"/>
                    <plc field="id" title="编号"/>
                    <plc field="size" title="大小"/>
                    <plc field="date" title="日期"/>
                    <plc field="color" title="颜色"/>
                    <plc field="name" title="名称"/>
                    <plc field="star" title="评分"/>
                    <plc field="star" title="评分" fixed="right"/>
                    <plc field="size" title="大小"/>
                    <plc field="date" title="日期"/>
                    <plc field="color" title="颜色"/>
                    <plc field="name" title="名称"/>
                    <plc field="size" title="大小"/>
                    <plc field="date" title="日期"/>
                    <plc field="color" title="颜色"/>
                    <plc field="name" title="名称"/>
                    <plc field="size" title="大小"/>
                    <plc field="date" title="日期"/>
                    <plc field="color" title="颜色"/>
                    <plc field="name" title="名称"/>
                </template>
            </pl-table>
        </demo-row>
    </div>
</template>

<script>

    import data from '../data/data-1'


    export default {
        name: "table-fixed",
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
                    headRowHeight: 40,
                    bodyRowHeight: 36,
                    border: false,
                    virtual: true,
                },
                plc: {
                    width: 200,
                    align: 'left',
                    init: true,
                    order: 5,
                },
            }
        },
    }
</script>

<style lang="scss">

</style>