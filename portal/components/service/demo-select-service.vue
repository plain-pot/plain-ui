<template>
    <div class="demo-select-service">
        <im-demo-row title="基本用法">
            <im-button label="toggle" @click="select(0)" ref="button0"/>
        </im-demo-row>
        <im-demo-row title="测试select服务以及popper服务性能优化">
            <im-button label="Button1" @click="select(1)" ref="button1"/>
            <im-button label="Button2" @click="select(2)" ref="button2"/>
        </im-demo-row>
        <im-demo-row title="测试popper参数">
            <im-button label="toggle" @click="select(3)" ref="button3"/>
        </im-demo-row>
        <im-demo-row title="搜索框">
            <im-button label="toggle" @click="select(4)" ref="button4"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-select-service",
        data() {
            return {
                select: {},

                option0: {
                    data: [
                        {name: '上海', val: 'shanghai'},
                        {name: '北京', val: 'beijing'},
                        {name: '广州', val: 'guangzhou'},
                    ],
                    labelKey: 'name',
                    valueKey: 'val'
                },
                option1: {
                    data: [
                        {name: '上海', val: 'shanghai'},
                        {name: '北京', val: 'beijing'},
                        {name: '广州', val: 'guangzhou'},
                    ],
                    labelKey: 'name',
                    valueKey: 'val'
                },
                option2: {
                    data: [
                        {name: '华盛顿', val: 'huashengdun'},
                        {name: '纽约', val: 'niuyue'},
                        {name: '佛罗里达', val: 'fololida'},
                    ],
                    labelKey: 'name',
                    valueKey: 'val',
                },
                option3: {
                    data: [
                        {name: '华盛顿', val: 'huashengdun'},
                        {name: '纽约', val: 'niuyue'},
                        {name: '佛罗里达', val: 'fololida'},
                    ],
                    labelKey: 'name',
                    valueKey: 'val',
                    disabledEqual: true,
                    width: '200px',
                    height: '150px',
                    arrow: true,
                },
                option4: {
                    data: [
                        {name: '华盛顿', val: 'huashengdun'},
                        {name: '纽约', val: 'niuyue'},
                        {name: '佛罗里达', val: 'fololida'},
                    ],
                    labelKey: 'name',
                    valueKey: 'val',
                    searchInput: true,
                },
            }
        },
        methods: {
            select(num) {
                this[`option${num}`].reference = this.$refs[`button${num}`]
                this.select[num] = this.$plain.$select.select(this[`option${num}`]).then(ret => {
                    console.log('done', {...ret})
                    this.$message.show(ret.name)
                })
            },
        }
    }
</script>

<style lang="scss">

</style>