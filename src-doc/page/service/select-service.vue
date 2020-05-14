<template>
    <div class="demo-select-service">

        <demo-row title="基本用法">
            <pl-button label="open select" @click="basicUsageData.toggle" ref="basicUsageButton"/>
        </demo-row>

        <demo-row title="自定义渲染函数中，子组件Vuex 是否正常">
            <pl-button-group>
                <pl-button label="open select" @click="testVuexData.toggle" ref="testButton"/>
                <pl-button label="increment" @click="$store.commit('increment',10)"/>
                <pl-button :label="`${$store.state.count}`"/>
            </pl-button-group>
        </demo-row>

        <demo-row title="实例复用">
            <pl-button ref="buttons" v-for="(item,index) in instances" :key="index" :label="item.option.value"
                       @click="item.toggle"/>
        </demo-row>

        <demo-row title="popoverProps设置 pl-popover 的属性">
            <pl-button label="open select" @click="testPopoverProps.toggle" ref="testPopoverProps"/>
        </demo-row>
        <demo-row title="labelKey以及valueKey">
            <pl-button label="open select" @click="testKey.toggle" ref="testKey"/>
        </demo-row>
        <demo-row title="禁用选中之后自动关闭">
            <pl-button label="open select" @click="testAutoClose.toggle" ref="testAutoClose"/>
        </demo-row>
        <demo-row title="禁用点击body自动关闭">
            <pl-button label="open select" @click="testCloseAfterBody.toggle" ref="testCloseAfterBody"/>
        </demo-row>
        <demo-row title="禁用键盘按键事件">
            <pl-button label="open select" @click="testKeyboard.toggle" ref="testKeyboard"/>
        </demo-row>
        <demo-row title="各种监听回调函数">
            <pl-button label="open select" @click="testListener.toggle" ref="testListener"/>
        </demo-row>
        <demo-row title="私有实例">
            <pl-button label="私有实例" @click="testPrivate.toggle" ref="testPrivate"/>
            <pl-button label="普通实例" @click="testNormal.toggle" ref="testNormal"/>
        </demo-row>
        <demo-row title="禁用、分组、图标">
            <pl-button label="open select" @click="keyTest.toggle" ref="keyTest"/>
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
                    service: null,
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
                        if (!result.service) {
                            result.service = await this.$plain.$select(result.option)
                        }
                        result.service.toggle()
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

            const testKey = newData('testKey', '星期三', {
                data: data.map(item => ({code: item + item, tag: item})),
                labelKey: 'tag',
                valueKey: 'code',
                onClick: (item) => {
                    testKey.option.value = item.value
                    console.log({...item}, {...testKey})
                }
            })

            const testAutoClose = newData('testAutoClose', null, {
                autoClose: false
            })
            const testCloseAfterBody = newData('testCloseAfterBody', null, {
                closeAfterBody: false
            })
            const testKeyboard = newData('testKeyboard', null, {
                keyboard: false
            })
            const testListener = newData('testListener', null, {
                onClick: (item) => {
                    testListener.option.value = item.value
                    console.log('onClick', {...item})
                },
                onShow: () => {
                    console.log('onShow')
                },
                onHide: () => {
                    console.log('onHide')
                },
                onClickBody: () => {
                    console.log('onClickBody')
                },
                onOpen: () => {
                    console.log('onOpen');
                },
                onClose: () => {
                    console.log('onClose');
                },
            })

            const testPrivate = newData('testPrivate', null, {
                private: true,
                render(h, data) {
                    return (
                        <div>
                            {data.label}-<input/>
                        </div>
                    )
                },
            })
            const testNormal = newData('testNormal', null, {
                render(h, data) {
                    return (
                        <div>
                            {data.label}-<input/>
                        </div>
                    )
                },
            })

            const keyTest = newData('keyTest', null, {
                data: [
                    {name: '广东省', val: 'guangdong', row_group: true},
                    {name: '深圳市', val: 'shenzhen', row_icon: 'el-icon-burger'},
                    {name: '广州市', val: 'guangzhou', row_icon: 'el-icon-tableware', row_disabled: true,},
                    {name: '佛山市', val: 'foshan', row_icon: 'el-icon-sugar'},
                    {name: '汕头市', val: 'shantou', row_icon: 'el-icon-dessert'},
                    {name: '湖南省', val: 'hunan', row_group: true},
                    {name: '长沙市', val: 'changsha', row_icon: 'el-icon-ice-cream', row_disabled: true,},
                    {name: '岳阳市', val: 'yueyang', row_icon: 'el-icon-hot-water'},
                    {name: '邵阳市', val: 'shaoyang', row_icon: 'el-icon-water-cup'},
                ],
                labelKey: 'name',
                valueKey: 'val',
                groupKey: 'row_group',
                disabledKey: 'row_disabled',
                iconKey: 'row_icon',
            })

            return {
                instances,
                basicUsageData,
                testVuexData,
                testPopoverProps,
                testKey,
                testAutoClose,
                testCloseAfterBody,
                testKeyboard,
                testListener,
                testPrivate,
                testNormal,
                keyTest,
            }
        },
        methods: {},
        mounted() {
        },
        beforeDestroy() {
            if (this.testPrivate.service) {
                this.testPrivate.service.destroy()
            }
        }
    }
</script>

<style lang="scss">
</style>