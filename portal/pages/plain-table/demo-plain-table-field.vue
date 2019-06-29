<template>
    <div class="demo-plain-table-field">
        <plain-table :option="demoFieldOption">
            <!--            <pl-tc-column field="id" title="编号"/>-->
            <pl-tc-input field="input" title="输入框"/>
            <pl-tc-number field="number" title="数字输入框"/>
            <pl-tc-date field="date" title="日期选择框"/>
            <pl-tc-time field="time" title="时间选择框"/>
            <pl-tc-select field="sel" title="下拉选择框" :prop="{data:selectData,labelKey:'name',valueKey:'val'}"/>
            <!--            <pl-tc-ov field="ov" title="选项值选择框"/>-->
            <pl-tc-color field="color" title="颜色选择框"/>
            <!--            <pl-tc-obj field="obj" title="对象选择框"/>-->
            <!--            <pl-tc-transfer field="transfer" title="穿梭选择框"/>-->
            <!--            <pl-tc-address field="address" title="地址选择框"/>-->
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
                    }
                }),
                selectData: [
                    {name: '北京', val: 'beijing'},
                    {name: '上海', val: 'shanghai'},
                    {name: '广州', val: 'guangzhou'},
                ]
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
