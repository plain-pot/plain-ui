<template>
    <div class="demo-select-service">

        <demo-row title="基本用法">
            <pl-button label="open select" @click="basicUsage" ref="basicUsageButton"/>
        </demo-row>

        <demo-row title="测试 vuex 是否正常">
            <pl-button-group>
                <pl-button label="open select" @click="testVuex" ref="testButton"/>
                <pl-button label="increment" @click="$store.commit('increment',10)"/>
                <pl-button :label="`${$store.state.count}`"/>
            </pl-button-group>
        </demo-row>

        <demo-row title="测试实例复用">
            <pl-button ref="buttons" v-for="(item,index) in instances" :key="index" :label="item.option.value"
                       @click="item.toggle"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-select-service",
        props: {},
        data() {

            const data = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '春节', '元宵节', '情人节', '万圣节']

            const instances = []
            for (let i = 0; i < 6; i++) {
                instances.push({
                    ins: null,
                    option: {
                        data,
                        reference: () => this.$refs.buttons[i],
                        value: data[i],
                        onClick: (item) => {
                            instances[i].option.value = item.value
                        },
                    },
                    toggle: async () => {
                        if (!instances[i].ins) {
                            instances[i].ins = await this.$plain.$select.newSelect(instances[i].option)
                        }
                        instances[i].ins.toggle()
                    },
                })

            }

            return {
                instances,
                basicUsageData: {
                    select: null,
                    option: {
                        data: ['春节', '重阳节', '万圣节', '圣诞节', '除夕', '春至', '建军节', '国庆节', '中秋节', '清明节', '青年节'],
                        value: '重阳节',
                        reference: () => this.$refs.basicUsageButton,
                        onClick: (item) => {
                            this.basicUsageData.option.value = item.value
                        }
                    },
                },
                testVuexData: {
                    select: null,
                    option: {
                        data: ['春节', '重阳节', '万圣节', '圣诞节', '除夕', '春至', '建军节', '国庆节', '中秋节', '清明节', '青年节'],
                        value: '重阳节',
                        reference: () => this.$refs.testButton,
                        onClick: (item) => {
                            this.testVuexData.option.value = item.value
                        },
                        render(h, data) {
                            return (<TestVuexComponent label={data.label}/>)
                        },
                    },
                },
            }
        },
        methods: {
            async basicUsage() {
                if (!this.basicUsageData.select) {
                    this.basicUsageData.select = await this.$plain.$select.newSelect(this.basicUsageData.option)
                }
                this.basicUsageData.select.toggle()
            },
            async testVuex() {
                if (!this.testVuexData.select) {
                    this.testVuexData.select = await this.$plain.$select.newSelect(this.testVuexData.option)
                }
                this.testVuexData.select.toggle()
            },

        },
        mounted() {
        }
    }
</script>

<style lang="scss">
</style>