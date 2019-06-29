<template>
    <div class="demo-plain-object">
        <im-demo-row title="服务">
            <pl-button label="单选" @click="pl_showService"/>
            <pl-button label="多选" @click="pl_showService2"/>
        </im-demo-row>
        <im-demo-row title="选择框">
            <pl-object :option="fieldOption" :map="{name:'input',objectId:'id'}" :row="row" showField="name"/>
            <span>result:{{row}}</span>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-plain-object",
        data() {
            const selectData = [
                {name: '北京', val: 'beijing'},
                {name: '上海', val: 'shanghai'},
                {name: '广州', val: 'guangzhou'},
            ]
            return {
                row: {},

                selectData,
                fieldOption: new PlainOption({
                    context: this,
                    module: 'demoField',
                    renderFunc(h) {
                        return (
                            <div>
                                <pl-tc-input field="input" title="输入框"/>
                                <pl-tc-number field="number" title="数字输入框"/>
                                <pl-tc-date field="date" title="日期选择框"/>
                                <pl-tc-time field="time" title="时间选择框"/>
                                <pl-tc-select field="sel" title="下拉选择框" prop={{data: selectData, labelKey: 'name', valueKey: 'val'}}/>
                                <pl-tc-color field="color" title="颜色选择框"/>
                                <pl-tc-radio field="radio" title="单选复选框"/>
                                <pl-tc-toggle field="toggle" title="开关选择框"/>
                            </div>
                        )
                    }
                }),
                addressOption: new PlainOption({
                    context: this,
                    module: 'address',
                    multiSelect: true,
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
                })
            }
        },
        methods: {
            pl_showService() {
                this.$object.pick(this.fieldOption, ({row}) => {
                    this.$dialog.show(row.input)
                })
            },
            pl_showService2() {
                this.$object.pick(this.addressOption, (ret) => {
                    const msg = ret.map((item) => item.row.name).join(',')
                    this.$dialog.show(msg)
                })
            },
        }
    }
</script>

<style lang="scss">

</style>
