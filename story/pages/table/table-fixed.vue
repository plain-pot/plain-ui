<template>
    <div class="table-fixed">
        <demo-row title="属性控制">
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
                <pl-form-item label="列销毁测试(颜色)">
                    <pl-toggle v-model="plc.init"/>
                </pl-form-item>
                <!-- <pl-form-item label="文本对齐方式">
                     <pl-radio-group v-model="plc.align">
                         <pl-radio label="left" val="left"/>
                         <pl-radio label="center" val="center"/>
                         <pl-radio label="right" val="right"/>
                     </pl-radio-group>
                 </pl-form-item>-->
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
        </demo-row>
        <demo-row title="固定列">
            <pl-table :data="tableData"
                      :summaryData="other.hasSummaryData?summaryData:null"
                      v-bind="props">

                <template v-if="other.groupHead">
                    <plc field="id" title="编号" fixed="left" :width="plc.width"/>
                    <plc field="id" title="编号"/>
                    <plc field="size" title="大小"/>
                    <plc-group title="地址" fixed="left">
                        <plc field="date" title="日期"/>
                        <plc field="color" title="颜色" v-if="plc.init"/>
                    </plc-group>

                    <plc field="id" title="编号"/>
                    <plc field="star" title="评分"/>
                    <plc field="addr" title="地址"/>

                    <plc field="name" title="名称" fixed="right"/>
                    <plc-group title="站点" fixed="right">
                        <plc field="url" title="链接"/>
                        <plc field="domain" title="域名"/>
                    </plc-group>

                    <plc field="protocol" title="协议"/>
                    <plc field="email" title="邮箱"/>
                    <plc field="ip" title="ip"/>
                </template>

                <template v-else>
                    <plc field="id" title="编号" fixed="left"/>
                    <plc field="size" title="大小"/>
                    <plc field="date" title="日期"/>
                    <plc field="color" title="颜色" v-if="plc.init"/>
                    <plc field="name" title="名称" fixed="right"/>
                    <plc field="star" title="评分"/>

                    <plc field="addr" title="地址"/>
                    <plc field="url" title="链接"/>
                    <plc field="domain" title="域名"/>
                    <plc field="protocol" title="协议"/>
                    <plc field="email" title="邮箱"/>
                    <plc field="ip" title="ip"/>
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
                        "id": 1998,
                        "color": "#f27994",
                        "name": "Sandra",
                        "date": "1994-02-12",
                        "star": "★★★★★★",
                        "size": 77,
                        "addr": "台湾 高雄市 甲仙区",
                        "url": "gopher://gcycumnnsl.py/nqazhyfq",
                        "domain": "xqcvo.gi",
                        "protocol": "gopher",
                        "email": "l.vpxx@oeyxdmmw.bw",
                        "ip": "31.182.173.18"
                    },
                    {
                        "id": 1999,
                        "color": "#79b7f2",
                        "name": "Sarah",
                        "date": "1985-09-17",
                        "star": "★★★★★",
                        "size": 75,
                        "addr": "安徽省 淮北市 濉溪县",
                        "url": "gopher://nfqgcghj.al/ycn",
                        "domain": "bxegkwtg.th",
                        "protocol": "ftp",
                        "email": "h.xfjyebb@xdvsaj.cq",
                        "ip": "94.157.166.104"
                    }
                ],

                other: {
                    hasSummaryData: true,                       // 是否由合计行数据
                    groupHead: true,                            // 表头分组
                },
                props: {
                    headRowHeight: 40,
                    bodyRowHeight: 36,
                    border: false,
                    virtual: true,                             // 是否开启虚拟滚动
                },
                plc: {
                    width: 120,
                    align: 'left',
                    init: true,
                    order: 5,
                },
            }
        },
    }
</script>

<style lang="scss">
    .table-fixed {
    }
</style>