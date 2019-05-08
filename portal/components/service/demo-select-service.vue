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
        <im-demo-row title="移动选择项">
            <im-button label="toggle" @click="select(6)" ref="button6"/>
        </im-demo-row>
        <im-demo-row title="自定义渲染内容，渲染函数">
            <im-button label="toggle" @click="select(7)" ref="button7"/>
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
                    popper:{
                        disabledEqual: true,
                        width: '200px',
                        height: '150px',
                        arrow: true,
                    },
                },
                option4: {
                    searchInput: true,
                },
                option5: {
                   popper:{
                       disabledEqual: true,
                       width: '200px',
                   }
                },
                option7: {
                    popper:{
                        width: '150px',
                        disabledEqual: true,
                    },
                    render(h, {item, index}) {
                        return <div class="demo-select-item">
                            <div class="demo-select-item-title">{item.name}</div>
                            <div class="demo-select-item-desc">{item.desc}</div>
                        </div>
                    },
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
                            {name: '湖南', desc: '金三角建材城', val: '1'},
                            {name: '湖北', desc: '中豪装饰城', val: '2'},
                            {name: '江西', desc: '红星美凯龙', val: '3'},
                            {name: '山东', desc: '大红房装饰城', val: '4'},
                            {name: '山西', desc: '红星美凯龙和平商场', val: '5'},
                            {name: '广西', desc: '红星美凯龙方北商场', val: '6'},
                            {name: '安徽', desc: '怀特装饰城', val: '7'},
                            {name: '河北', desc: '红房子家居广场', val: '8'},
                            {name: '河南', desc: '758陶瓷市场', val: '9'},
                            {name: '广东', desc: '好家居装饰城', val: '10'},
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
    .demo-select-item {
        .demo-select-item-title {
            color: #333;
            font-size: 14px;
        }

        .demo-select-item-desc {
            color: #999;
            font-size: 12px;
        }
    }
</style>