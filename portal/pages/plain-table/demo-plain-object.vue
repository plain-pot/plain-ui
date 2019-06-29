<template>
    <div class="demo-plain-object">
        <pl-button label="服务选择" @click="pl_showService"/>
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
                })
            }
        },
        methods: {
            pl_showService() {
                this.$object.pick(this.fieldOption, (ret) => {
                    console.log(ret)
                })
            },
        }
    }
</script>

<style lang="scss">

</style>
