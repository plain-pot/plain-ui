<template>
    <div class="demo-base-table-column-prop">
        <!--        <im-demo-row>-->
        <!--            <im-toggle v-model="p_show"/>-->
        <!--        </im-demo-row>-->
        <!--        <im-demo-row title="基本用法" v-show="p_show">-->
        <!--            <im-base-table :data="data" id="trainno">-->
        <!--                <im-tc-column title="类型" field="type"/>-->
        <!--                <im-tc-column title="车次" field="trainno"/>-->
        <!--                <im-tc-column title="用时" field="costtime"/>-->
        <!--                <im-tc-column title="出发站" field="station"/>-->
        <!--                <im-tc-column title="到达站" field="endstation"/>-->
        <!--            </im-base-table>-->
        <!--        </im-demo-row>-->

        <!--        <im-demo-row title="列宽度">-->
        <!--            <im-base-table :data="data" id="trainno">-->
        <!--                <im-tc-column title="类型,width=100px" field="type" fixed="left" width="300px"/>-->
        <!--                <im-tc-column title="车次,width=300" field="trainno" :width="300"/>-->
        <!--                <im-tc-column title="用时" field="costtime"/>-->
        <!--                <im-tc-column title="出发站" field="station"/>-->
        <!--                <im-tc-column title="到达站" field="endstation" fixed="right"/>-->
        <!--            </im-base-table>-->
        <!--        </im-demo-row>-->

        <!--        <im-demo-row title="列宽度权重">-->
        <!--            <im-base-table :data="data" id="trainno">-->
        <!--                <im-tc-column title="类型" field="type" fixed="left"/>-->
        <!--                <im-tc-column title="车次,fit=2" field="trainno" :fit="2"/>-->
        <!--                <im-tc-column title="用时,fit=1" field="costtime" :fit="1"/>-->
        <!--                <im-tc-column title="出发站" field="station"/>-->
        <!--                <im-tc-column title="到达站" field="endstation" fixed="right"/>-->
        <!--            </im-base-table>-->
        <!--        </im-demo-row>-->

        <!--        <im-demo-row title="列排序">-->
        <!--            <im-base-table :data="data" id="trainno">-->
        <!--                <im-tc-column title="类型" field="type" fixed="left"/>-->
        <!--                <im-tc-column title="车次poi=1,order=1" field="trainno" :order="1"/>-->
        <!--                <im-tc-column title="用时poi=2,order=2" field="costtime" :order="2"/>-->
        <!--                <im-tc-column title="出发站poi=3,order=3" field="station" :order="3"/>-->
        <!--                <im-tc-column title="到达站" field="endstation" fixed="right"/>-->
        <!--            </im-base-table>-->
        <!--        </im-demo-row>-->

        <!--        <im-demo-row title="固定列">-->
        <!--            <im-base-table :data="data" id="trainno">-->
        <!--                <im-tc-column title="类型,fixed=left" field="type" fixed="left"/>-->
        <!--                <im-tc-column title="车次" field="trainno"/>-->
        <!--                <im-tc-column title="用时" field="costtime"/>-->
        <!--                <im-tc-column title="出发站" field="station"/>-->
        <!--                <im-tc-column title="到达站,fixed=right" field="endstation" fixed="right"/>-->
        <!--                <im-tc-column title="出发时间" field="departuretime"/>-->
        <!--                <im-tc-column title="到达时间" field="arrivaltime"/>-->
        <!--                <im-tc-column title="顺序" field="sequenceno"/>-->
        <!--                <im-tc-column title="用时" field="costtime"/>-->
        <!--                <im-tc-column title="距离" field="distance"/>-->
        <!--                <im-tc-column title="是否终点" field="isend"/>-->
        <!--                <im-tc-column title="商务座票价" field="pricesw"/>-->
        <!--                <im-tc-column title="特等座票价" field="pricetd"/>-->
        <!--                <im-tc-column title="高级软卧上票价" field="pricegr1"/>-->
        <!--                <im-tc-column title="高级软卧下票价" field="pricegr2"/>-->
        <!--            </im-base-table>-->
        <!--        </im-demo-row>-->

        <!--        <im-demo-row title="自动固定">-->
        <!--            <im-base-table :data="data" id="trainno">-->
        <!--                <im-tc-column title="类型,fixed=left" field="type" fixed="left"/>-->
        <!--                <im-tc-column title="车次,placeLeft" field="trainno" placeLeft/>-->
        <!--                <im-tc-column title="用时" field="costtime"/>-->
        <!--                <im-tc-column title="出发站,placeRight" field="station" placeRight/>-->
        <!--                <im-tc-column title="到达站,fixed=right" field="endstation" fixed="right"/>-->
        <!--                <im-tc-column title="出发时间" field="departuretime"/>-->
        <!--                <im-tc-column title="到达时间" field="arrivaltime"/>-->
        <!--                <im-tc-column title="顺序" field="sequenceno"/>-->
        <!--                <im-tc-column title="用时" field="costtime"/>-->
        <!--                <im-tc-column title="距离" field="distance"/>-->
        <!--                <im-tc-column title="是否终点" field="isend"/>-->
        <!--                <im-tc-column title="商务座票价" field="pricesw"/>-->
        <!--                <im-tc-column title="特等座票价" field="pricetd"/>-->
        <!--                <im-tc-column title="高级软卧上票价" field="pricegr1"/>-->
        <!--                <im-tc-column title="高级软卧下票价" field="pricegr2"/>-->
        <!--            </im-base-table>-->
        <!--        </im-demo-row>-->

        <!--        <im-demo-row>-->
        <!--            <im-toggle v-model="isHide"/>-->
        <!--        </im-demo-row>-->
        <!--        <im-demo-row title="列隐藏显示">-->
        <!--            <im-base-table :data="data" id="trainno">-->
        <!--                <im-tc-column title="类型" field="type" fixed="left"/>-->
        <!--                <im-tc-column title="车次,hide=isHide" field="trainno" :hide="isHide"/>-->
        <!--                <im-tc-column title="用时" field="costtime"/>-->
        <!--                <im-tc-column title="出发站" field="station"/>-->
        <!--                <im-tc-column title="到达站" field="endstation" fixed="right"/>-->
        <!--            </im-base-table>-->
        <!--        </im-demo-row>-->

        <!--        <im-demo-row title="对其方式">-->
        <!--            <im-base-table :data="data" id="trainno">-->
        <!--                <im-tc-column title="类型,align=right" field="type" align="right"/>-->
        <!--                <im-tc-column title="车次,align=center" field="trainno" align="center"/>-->
        <!--                <im-tc-column title="用时,align=left" field="costtime" align="left"/>-->
        <!--                <im-tc-column title="出发站" field="station"/>-->
        <!--                <im-tc-column title="到达站" field="endstation"/>-->
        <!--            </im-base-table>-->
        <!--        </im-demo-row>-->

        <!--        <im-demo-row title="点击样式">-->
        <!--            <im-base-table :data="data" id="trainno">-->
        <!--                <im-tc-column title="类型 link" field="type"/>-->
        <!--                <im-tc-column title="车次" field="trainno" link :click="({data:d})=>$dialog.show(JSON.stringify(d.row),{width:'500px',height:'300px',editType:'textarea',editReadonly:true})"/>-->
        <!--                <im-tc-column title="用时" field="costtime"/>-->
        <!--                <im-tc-column title="出发站" field="station"/>-->
        <!--                <im-tc-column title="到达站" field="endstation"/>-->
        <!--            </im-base-table>-->
        <!--        </im-demo-row>-->

        <im-demo-row title="点击在对话框中展示">
            <im-base-table :data="data" id="trainno">
                <im-tc-column title="类型" field="type"/>
                <im-tc-column title="车次,showInDialog" field="trainno" showInDialog/>
                <im-tc-column title="用时" field="costtime"/>
                <im-tc-column title="出发站" field="station"/>
                <im-tc-column title="到达站" field="endstation"/>
            </im-base-table>
        </im-demo-row>
    </div>
</template>

<script>
    import {SimpleTableData} from "../../data";

    export default {
        name: "demo-base-table-column-prop",
        data() {
            const data = this.$plain.$utils.deepCopy(SimpleTableData)

            data.forEach(item => {
                item.tooltip = this.$plain.$utils.uuid()
            })

            return {
                isHide: false,
                p_show: true,
                data,
            }
        },
        methods: {
            onClick() {
                console.log(arguments)
            },
        }
    }
</script>

<style lang="scss">

</style>