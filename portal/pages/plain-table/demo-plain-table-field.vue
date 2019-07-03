<template>
    <div class="demo-plain-table-field">
        <plain-table :option="demoFieldOption">
            <!--            <pl-tc-column field="id" title="编号"/>-->
            <pl-tc-input field="input" title="输入框"/>
            <pl-tc-number field="number" title="数字输入框"/>
            <pl-tc-date field="date" title="日期选择框"/>
            <pl-tc-time field="time" title="时间选择框"/>
            <pl-tc-select field="sel" title="下拉选择框" :prop="{data:selectData,labelKey:'name',valueKey:'val'}"/>
            <pl-tc-ov field="ov" title="选项值选择框" type="POSTN_TYPE"/>
            <pl-tc-color field="color" title="颜色选择框"/>
            <pl-tc-object field="objName" title="对象选择框" :prop="{option:tableAddressOption,map:{obj:'id',objName:'name'}}"/>
            <pl-tc-address field="province" title="地址选择：省" province/>
            <pl-tc-address field="city" title="地址选择：市" city parentField="province"/>
            <pl-tc-address field="area" title="地址选择：县" area parentField="city"/>
            <pl-tc-radio field="radio" title="单选复选框"/>
            <pl-tc-toggle field="toggle" title="开关选择框"/>
        </plain-table>
    </div>
</template>

<script>
    export default {
        name: "demo-plain-table-field",
        data() {
            return {
                demoFieldOption: new PlainOption({
                    context: this,
                    module: 'demoField',
                    fixedRowData: [
                        {
                            color: "#702B2B",
                            createdAt: "2019-06-29 18:35:16",
                            date: "2019-11-10",
                            id: "1144917241272205312",
                            input: "华为",
                            number: "988",
                            obj: "1144180642968240128",
                            objName: "甘肃省",
                            ov: "home_advisier",
                            radio: "Y",
                            sel: "shanghai",
                            time: "09:01:01",
                            toggle: "Y",
                            updatedAt: "2019-07-02 09:40:00",
                        }
                    ],
                    buttons: {
                        /*测试重载按钮属性*/
                        /*insertButton: {
                            handler() {
                                this.$message.show('insertButton')
                                console.log(this)
                            },
                        }*/
                        /*测试去掉按钮*/
                        // insertButton: false,
                        testDisabledButton: {
                            label: '单复选框选中时可用',
                            disabled() {
                                const selectDataRow = this.demoFieldOption.selectDataRow
                                if (!selectDataRow) return true
                                if (selectDataRow.row.radio !== 'Y') return true
                                return false
                            },
                            handler() {
                                this.$message.show('单复选框选中时可用')
                            },
                        },
                    }
                }),
                selectData: [
                    {name: '北京', val: 'beijing'},
                    {name: '上海', val: 'shanghai'},
                    {name: '广州', val: 'guangzhou'},
                ],
                tableAddressOption: new PlainOption({
                    context: this,
                    module: 'address',
                    filters: [
                        {field: 'deep', value: '0'}
                    ],
                    renderFunc(h) {
                        return (
                            <div>
                                <pl-tc-input field="name" title="地址名称" required width="100px" tooltip/>
                                <pl-tc-input field="code" title="地址代码" width="100px" required/>
                                <pl-tc-column field="parentName" title="父级地址名称" width="100px" tooltip/>
                                <pl-tc-column field="parentCode" title="父级地址代码" width="100px"/>
                                <pl-tc-input field="longitude" title="经度" width="100px"/>
                                <pl-tc-input field="latitude" title="纬度" width="100px"/>
                                <pl-tc-input field="deep" title="地址级别" width="100px"/>
                            </div>
                        )
                    }
                }),
            }
        },
    }
</script>

<style lang="scss">
    .demo-plain-table-field {
        padding: 16px 0;
        box-sizing: border-box;
    }
</style>
