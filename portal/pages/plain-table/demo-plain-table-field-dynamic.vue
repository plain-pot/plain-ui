<template>
    <div class="demo-plain-table-field-dynamic">
        <plain-table :option="demoFieldOption">
            <!--            <pl-tc-column field="id" title="编号"/>-->
            <pl-tc-input field="input1" title="输入框([单选复选框]初始值为Y时可编辑)" :editableFunc="staticEditableFunc"/>
            <pl-tc-input field="input2" title="输入框([单选复选框]初始值为Y时必输)" :requiredFunc="staticRequiredFunc"/>
            <pl-tc-input field="input3" title="输入框([单选复选框]初始值为Y时必输可编辑)" :editableFunc="staticEditableFunc" :requiredFunc="staticRequiredFunc"/>
            <!--            <pl-tc-number field="number" title="数字输入框"/>-->
            <!--            <pl-tc-date field="date" title="日期选择框"/>-->
            <!--            <pl-tc-time field="time" title="时间选择框"/>-->
            <!--            <pl-tc-select field="sel" title="下拉选择框" :prop="{data:selectData,labelKey:'name',valueKey:'val'}"/>-->
            <!--            &lt;!&ndash;            <pl-tc-ov field="ov" title="选项值选择框"/>&ndash;&gt;-->
            <!--            <pl-tc-color field="color" title="颜色选择框"/>-->
            <!--            &lt;!&ndash;            <pl-tc-obj field="obj" title="对象选择框"/>&ndash;&gt;-->
            <!--            &lt;!&ndash;            <pl-tc-transfer field="transfer" title="穿梭选择框"/>&ndash;&gt;-->
            <!--            &lt;!&ndash;            <pl-tc-address field="address" title="地址选择框"/>&ndash;&gt;-->
            <pl-tc-radio field="radio" title="单选复选框"/>
            <!--            <pl-tc-toggle field="toggle" title="开关选择框"/>-->


            <pl-tc-input field="input4" title="输入框([单选复选框]编辑值为Y时可编辑)" :editableFunc="dynamicEditableFunc"/>
            <pl-tc-input field="input5" title="输入框([单选复选框]编辑值为Y时必输)" :requiredFunc="dynamicRequiredFunc"/>
            <pl-tc-input field="input6" title="输入框([单选复选框]编辑值为Y时必输可编辑)" :editableFunc="dynamicEditableFunc" :requiredFunc="dynamicRequiredFunc"/>
        </plain-table>
    </div>
</template>

<script>
    export default {
        name: "demo-plain-table-field-dynamic",
        data() {
            return {
                demoFieldOption: new PlainOption({
                    context: this,
                    module: 'demoField'
                }),
                selectData: [
                    {name: '北京', val: 'beijing'},
                    {name: '上海', val: 'shanghai'},
                    {name: '广州', val: 'guangzhou'},
                ]
            }
        },
        methods: {
            staticEditableFunc({row, editRow}) {
                return row.radio === 'Y'
            },
            staticRequiredFunc({row, editRow}) {
                return row.radio === 'Y'
            },
            dynamicEditableFunc({row, editRow}) {
                return editRow.radio === 'Y'
            },
            dynamicRequiredFunc({row, editRow}) {
                return editRow.radio === 'Y'
            },
        }
    }
</script>

<style lang="scss">
    .demo-plain-table-field-dynamic {
        padding: 16px 0;
        box-sizing: border-box;
    }
</style>