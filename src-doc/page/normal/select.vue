<template>
    <div class="demo-select">
        <demo-row title="select-service">
            <demo-row title="基本用法">
                <pl-button :label="basic.option.props.value || 'open select'" @click="basic.toggle" ref="basic"/>
            </demo-row>
        </demo-row>
    </div>
</template>

<script>
    import {$select} from "../../../src/packages/select/service/SelectService";

    export default {
        name: "demo-select",
        data() {

            const newData = (name, option) => {

                let result = {
                    agent: null,
                    option: {
                        reference: () => this.$refs[name],
                        props: {
                            value: null,
                            content: (h) => {
                                return [
                                    <pl-select-option label="深圳市" val="shenzhen"/>,
                                    <pl-select-option label="佛山市" val="foshan"/>,
                                    <pl-select-option label="广州市" val="guangzhou"/>,
                                ]
                            },
                            ...option,
                        },
                        listener: {
                            change: (val) => {
                                result.option.props.value = val
                            }
                        },
                    },
                    toggle: async () => {
                        if (!result.agent) {
                            result.agent = await $select(() => result.option)
                        }
                        result.agent.toggle()
                    },
                }
                return result
            }

            const basic = newData('basic')

            return {
                val: {
                    0: 'shenzhen',

                },
                list: [
                    {name: '春节', val: 'Chun'},
                    {name: '万圣节', val: 'WanSheng'},
                    {name: '青年节', val: 'QinNian'},
                    {name: '中年节', val: 'ZhongNian', row_disabled: true,},
                    {name: '国庆节', val: 'GuoQing', row_disabled: true,},
                    {name: '中秋节', val: 'ZhongQiu', row_disabled: true,},
                    {name: '劳动节', val: 'LaoDong', row_disabled: true,},
                    {name: '圣诞节', val: 'ShengDan'},
                    {name: '儿童节', val: 'ErTong'},
                    {name: '妇女节', val: 'FuNv'},
                    {name: '教师节', val: 'JiaoShi'},
                    {name: '清明节', val: 'QingMing'},
                ],
                groupData: [
                    {
                        name: '广东省',
                        children: [
                            {name: '深圳市', val: 'shenzhen', i: 'el-icon-burger'},
                            {name: '广州市', val: 'guangzhou', i: 'el-icon-tableware'},
                            {name: '佛山市', val: 'foshan', i: 'el-icon-sugar'},
                            {name: '梅州市', val: 'meizhou', i: 'el-icon-dessert'},
                        ],
                    },
                    {
                        name: '湖南省',
                        children: [
                            {name: '长沙市', val: 'changsha', i: 'el-icon-ice-cream'},
                            {name: '岳阳市', val: 'yueyang', i: 'el-icon-water-cup'},
                            {name: '邵阳市', val: 'shaoyang', i: 'el-icon-watermelon'},
                        ]
                    }
                ],

                flag: {
                    disabled: true,
                    readonly: true,
                    loading: true,
                },
                initFlag: true,

                basic,

                filterText: null,
                filterMethod: (option) => {
                    if (!this.filterText || !this.filterText.trim()) {
                        return true
                    }
                    return option.label.indexOf(this.filterText) > -1
                }
            }
        },
        methods: {
            customFilterMethod(input, item) {
                if (!input || !input.trim()) return true
                const {label, val} = item
                return (label.toLowerCase() + val.toLowerCase()).indexOf(input.toLowerCase()) > -1
            },
        },
    }
</script>

<style lang="scss">
</style>