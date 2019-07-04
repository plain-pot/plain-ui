<template>
    <div class="demo-select">
        <im-demo-row title="基本用法">
            <im-select :data="data" labelKey="label" valueKey="val" v-model="val[1]"/>
            <im-button :label="val[1]"/>
        </im-demo-row>
        <im-demo-row title="双向绑定">
            <im-select :data="data" labelKey="label" valueKey="val" v-model="val[1]"/>
            <im-select :data="data" labelKey="label" valueKey="val" v-model="val[1]"/>
        </im-demo-row>
        <im-demo-row title="禁用与只读">
            <im-select :data="data" labelKey="label" valueKey="val" readonly v-model="val[1]"/>
            <im-select :data="data" labelKey="label" valueKey="val" disabled v-model="val[1]"/>
        </im-demo-row>
        <im-demo-row title="多选">
            <im-select :data="data" labelKey="label" valueKey="val" v-model="val[2]" multiple/>
            <im-select :data="data" labelKey="label" valueKey="val" v-model="val[2]" multiple/>
        </im-demo-row>
        <im-demo-row title="自定义渲染内容">
            <im-select :data="data" labelKey="label" valueKey="val" v-model="val[2]" multiple>
                <template slot-scope="{item,index}">
                    <div class="demo-select-item-line">
                        <span>{{item.label}}</span>
                        <span>{{item.val}}</span>
                    </div>
                    <div class="demo-select-item-line">
                        <span>{{item.label}} - {{item.val}}</span>
                        <span>{{item.val}}</span>
                    </div>
                </template>
            </im-select>
        </im-demo-row>
        <im-demo-row title="表格列">
            <plain-table :option="demoFieldOption">
                <!--            <pl-tc-column field="id" title="编号"/>-->
                <pl-tc-input field="input" title="输入框"/>
                <pl-tc-number field="number" title="数字输入框"/>
                <pl-tc-date field="date" title="日期选择框"/>
                <pl-tc-time field="time" title="时间选择框"/>
                <pl-tc-select field="sel" title="下拉选择框" :prop="{data:selectData,labelKey:'name',valueKey:'val',before:beforeSelect,after:afterSelect}"/>
                <!--            <pl-tc-ov field="ov" title="选项值选择框"/>-->
                <pl-tc-color field="color" title="颜色选择框"/>
                <!--            <pl-tc-obj field="obj" title="对象选择框"/>-->
                <!--            <pl-tc-address field="address" title="地址选择框"/>-->
                <pl-tc-radio field="radio" title="单选复选框"/>
                <pl-tc-toggle field="toggle" title="开关选择框"/>
            </plain-table>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-select",
        data() {
            return {
                data: [
                    {label: '面包', val: 'mianbao'},
                    {label: '饼干', val: 'binggan'},
                    {label: '牛奶', val: 'niunai'},
                    {label: '黄油', val: 'huangyou'},
                    {label: '奶酪', val: 'nailao'},
                    {label: '曲奇饼', val: 'quqi'},
                    {label: '芝士', val: 'zhishi'},
                    {label: '蛋卷', val: 'danjuan'},
                    {label: '坚果', val: 'jianguo'},
                    {label: '哈根达斯', val: 'hagendasi'},
                    {label: '棒棒糖', val: 'bangbagntang'},
                    {label: '果冻', val: 'guodong'},
                ],
                val: {},

                demoFieldOption: new PlainOption({
                    context: this,
                    module: 'demoField',
                }),
                selectData: [
                    {name: '北京', val: 'beijing'},
                    {name: '上海', val: 'shanghai'},
                    {name: '广州', val: 'guangzhou'},
                ]
            }
        },
        methods: {
            beforeSelect({editRow}, value) {
                if (editRow.radio !== 'Y') {
                    const msg = '请选勾选【单选复选框】'
                    this.$dialog.show(msg)
                    return Promise.reject(msg)
                }
            },
            afterSelect(dataRow, value) {
                this.$message.show('after select:' + value)
            },
        }
    }
</script>

<style lang="scss">
    .demo-select-item-line {
        display: flex;
        justify-content: space-between;
    }
</style>
