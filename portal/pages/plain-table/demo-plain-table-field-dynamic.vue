<template>
    <div class="demo-plain-table-field-dynamic">
        <plain-table :option="demoFieldOption">
            <!--            <pl-tc-column field="id" title="编号"/>-->
            <pl-tc-radio field="radio" title="单选复选框"/>

            <pl-tc-input field="input1" title="输入框([单选复选框]初始值为Y时可编辑)" :editableFunc="staticEditableFunc" width="280px"/>
            <pl-tc-input field="input2" title="输入框([单选复选框]编辑值为Y时可编辑)" :editableFunc="dynamicEditableFunc" width="280px"/>

            <pl-tc-input field="input3" title="输入框([单选复选框]初始值为Y时必输)" :requiredFunc="staticRequiredFunc" width="280px"/>
            <pl-tc-input field="input4" title="输入框([单选复选框]编辑值为Y时必输)" :requiredFunc="dynamicRequiredFunc" width="280px"/>

            <pl-tc-input field="input5" title="输入框([单选复选框]初始值为Y时必输可编辑)" :editableFunc="staticEditableFunc" :requiredFunc="staticRequiredFunc" width="280px"/>
            <pl-tc-input field="input6" title="输入框([单选复选框]编辑值为Y时必输可编辑)" :editableFunc="dynamicEditableFunc" :requiredFunc="dynamicRequiredFunc" width="280px"/>
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
                    module: 'demoField',
                    rowFormatter(row) {
                        row.input1 = row.input2 = row.input
                    },
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
                console.log('staticEditableFunc')
                return row.radio === 'Y'
            },
            staticRequiredFunc({row, editRow}) {
                console.log('staticRequiredFunc')
                return row.radio === 'Y'
            },
            dynamicEditableFunc({row, editRow}) {
                console.log('dynamicEditableFunc');
                return editRow.radio === 'Y'
            },
            dynamicRequiredFunc({row, editRow}) {
                console.log('dynamicRequiredFunc');
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