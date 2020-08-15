<template>
    <div class="table-expand">
        <pl-table :data="data"
                  :summaryData="summaryData"
                  virtual>
            <plc-check ref="check" toggleOnClickRow/>
            <plc-expand toggleOnClickRow>
                <template slot-scope="{row}" slot="expand">
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
            <plc field="name" title="普通文本列"/>
            <plc-input field="name" title="文本框" required fixed="left"/>
            <plc-number field="size" title="数字框" :order="10"/>
            <plc-date field="date" title="日期" required/>
            <plc-color-picker field="color" title="颜色" :order="11"/>
            <plc-rate field="star" title="评分"/>
            <plc-toggle field="flag" title="开关" fixed="right"/>
        </pl-table>
    </div>
</template>

<script>

    import data from "../data/data-1.json";

    export default {
        name: "table-expand",
        data() {
            return {
                data,
                summaryData: data.slice(data.length - 2, data.length)
            }
        },
    }
</script>

<style lang="scss">

</style>