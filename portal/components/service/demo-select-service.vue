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
            <im-button label="toggle" @click="select(5)" ref="button5"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-select-service",
        data() {
            return {
                selectService: {},
                option2: {
                    data: [
                        {name: '上海', val: 'shanghai'},
                        {name: '北京', val: 'beijing'},
                        {name: '广州', val: 'guangzhou'},
                    ],
                },
                option3: {
                    disabledEqual: true,
                    width: '200px',
                    height: '150px',
                    arrow: true,
                },
                option4: {
                    searchInput: true,
                },
                option5: {
                    disabledEqual: true,
                    width: '200px',
                    searchInput: true,
                },
            }
        },
        methods: {
            async select(num) {
                if (!this.selectService[num]) {
                    this.selectService[num] = await this.$plain.$select.getSelect()
                    !this[`option${num}`] && (this[`option${num}`] = {})
                    !this[`option${num}`].reference && (this[`option${num}`].reference = this.$refs[`button${num}`])
                    this.selectService[num].select(Object.assign({}, {
                        data: [
                            {name: '湖南', val: '1'},
                            {name: '湖北', val: '2'},
                            {name: '江西', val: '3'},
                            {name: '山东', val: '4'},
                            {name: '山西', val: '5'},
                            {name: '广西', val: '6'},
                            {name: '安徽', val: '7'},
                            {name: '河北', val: '8'},
                            {name: '河南', val: '9'},
                            {name: '广东', val: '10'},
                        ],
                        labelKey: 'name',
                        valueKey: 'val',
                        onClose: () => this.selectService[num] = null
                    }, this[`option${num}`])).then(ret => {
                        console.log('done', {...ret})
                        this.$message.show(ret.name)
                    })
                } else {
                    this.selectService[num].hide()
                }
            },
        }
    }
</script>

<style lang="scss">

</style>