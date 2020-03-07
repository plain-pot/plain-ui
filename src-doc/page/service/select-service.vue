<template>
    <div class="demo-select-service">

        <demo-row title="基本用法">
            <pl-button label="open select" @click="basicUsageData.toggle" ref="basicUsageButton"/>
        </demo-row>

        <demo-row title="测试 vuex 是否正常">
            <pl-button-group>
                <pl-button label="open select" @click="testVuexData.toggle" ref="testButton"/>
                <pl-button label="increment" @click="$store.commit('increment',10)"/>
                <pl-button :label="`${$store.state.count}`"/>
            </pl-button-group>
        </demo-row>

        <demo-row title="测试实例复用">
            <pl-button ref="buttons" v-for="(item,index) in instances" :key="index" :label="item.option.value"
                       @click="item.toggle"/>
        </demo-row>

        <demo-row title="测试 popoverProps">
            <pl-button label="open select" @click="testPopoverProps.toggle" ref="testPopoverProps"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-select-service",
        props: {},
        data() {

            const data = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '春节', '元宵节', '情人节', '万圣节']

            function analyseReferenceName(data, name) {
                const names = name.split('.')
                let index = 0
                data = data[names[index]]
                while (!!data[names[++index]]) {
                    data = data[names[index]]
                }
                if (!data) {
                    console.log(`can't find ${name} in `, data, names)
                    return null
                } else {
                    return data
                }
            }

            const newData = (referenceName, initValue, externalOption = {}) => {
                const result = {
                    ins: null,
                    option: {
                        data,
                        reference: () => analyseReferenceName(this.$refs, referenceName),
                        value: initValue,
                        onClick: (item) => {
                            result.option.value = item.value
                        },
                        ...externalOption
                    },
                    toggle: async () => {
                        if (!result.ins) {
                            result.ins = await this.$plain.$select.newSelect(result.option)
                        }
                        result.ins.toggle()
                    },
                }
                return result
            }

            const instances = []
            for (let i = 0; i < 6; i++) {
                instances.push(newData(`buttons.${i}`, data[i]))
            }

            const basicUsageData = newData('basicUsageButton', '万圣节')
            const testVuexData = newData('testButton', '星期一', {
                render(h, data) {
                    return <TestVuexComponent label={data.label}/>
                },
            })
            const testPopoverProps = newData('testPopoverProps', '星期二', {
                popoverProps: {
                    placement: 'top-start',
                    scrollProps: {
                        scrollbarColor: '#12b4a5'
                    },
                },
            })

            return {
                instances,
                basicUsageData,
                testVuexData,
                testPopoverProps,
            }
        },
        methods: {},
        mounted() {
        }
    }
</script>

<style lang="scss">
</style>