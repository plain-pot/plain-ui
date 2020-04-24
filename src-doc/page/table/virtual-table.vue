<template>
    <div class="virtual-table">

        <demo-row title="属性控制">
            <pl-form>
                <pl-form-item label="禁用虚拟滚动">
                    <pl-toggle v-model="disabled"/>
                </pl-form-item>
                <pl-form-item label="合计行">
                    <pl-toggle v-model="hasSummaryData"/>
                </pl-form-item>
            </pl-form>
        </demo-row>
        <demo-row title="基本用法">
            <div style="height: 410px;overflow: hidden">
                <pl-virtual-table :data="tableData"
                                  :size="40"
                                  :width="3000"
                                  :summaryData="hasSummaryData?summaryData:null"
                                  :scrollProps="{alwaysShowScrollbar: true}"
                                  :disabled="disabled">
                    <template slot-scope="{item,index}">
                        <pl-item tag="tr" :key="index" :vid="index" block>
                            <td style="height: 40px;">{{JSON.stringify(item)}}</td>
                        </pl-item>
                    </template>
                </pl-virtual-table>
            </div>
        </demo-row>
    </div>
</template>

<script>
    import data from '../data/data-2'

    const summaryData = [
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
    ]

    export default {
        name: "virtual-table",
        data() {
            return {
                tableData: data,
                summaryData,
                hasSummaryData: true,

                disabled: false,
            }
        },
    }
</script>

<style lang="scss">

</style>