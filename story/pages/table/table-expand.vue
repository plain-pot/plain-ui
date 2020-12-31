<template>
    <div class="table-expand">
        <demo-row>
            <pl-table :data="data"
                      :summaryData="summaryData"
                      virtual>
                <!--            <plc-check ref="check" toggleOnClickRow/>-->
                <plc-expand :toggleOnClickRow="true">
                    <template v-slot:expand="{row}">
                        <pl-form column="1" disabled>
                            <pl-form-item label="普通文本">{{row.name}}</pl-form-item>
                            <pl-form-item label="输入框列">
                                <pl-input v-model="row.name"/>
                            </pl-form-item>
                            <pl-form-item label="数字框">
                                <pl-number v-model="row.size"/>
                            </pl-form-item>
                            <pl-form-item label="日期">
                                <pl-date v-model="row.date"/>
                            </pl-form-item>
                            <pl-form-item label="颜色">
                                <pl-color-picker v-model="row.color"/>
                            </pl-form-item>
                        </pl-form>
                    </template>
                </plc-expand>
                <plc-index/>
                <plc field="id" title="编号"/>
                <plc field="size" title="大小"/>
                <plc-group title="地址" fixed="left">
                    <plc field="date" title="日期"/>
                    <plc field="color" title="颜色"/>
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
            </pl-table>
        </demo-row>
    </div>
</template>

<script>

    import data from "../data/data-1.json";

    export default {
        name: "table-expand",
        data() {
            return {
                data: data.slice(0, data.length - 3),
                summaryData: data.slice(data.length - 2, data.length)
            }
        },
    }
</script>

<style lang="scss">

</style>