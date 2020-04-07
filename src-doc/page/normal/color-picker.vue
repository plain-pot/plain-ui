<template>
    <div class="color-picker">
        <demo-row title="颜色面板:基本用法">
            <demo-line>{{color1}}</demo-line>
            <demo-line>
                <pl-color-panel v-model="color1" format="hex"/>
            </demo-line>
        </demo-row>
        <demo-row title="颜色面板：透明度">
            <demo-line>{{color2}}</demo-line>
            <demo-line>
                <pl-color-panel v-model="color2" enableAlpha format="rgb"/>
            </demo-line>
        </demo-row>
        <demo-row title="ColorService">
            <demo-line>
                <pl-button :label="`无初始值[${test0.option.value}]`" @click="test0.toggle()" ref="test0"/>
                <pl-button :label="`hex值[${test1.option.value}]`" @click="test1.toggle()" ref="test1"/>
                <pl-button :label="`rgb值[${test2.option.value}]`" @click="test2.toggle()" ref="test2"/>
                <pl-button :label="`rgba值[${test3.option.value}]`" @click="test3.toggle()" ref="test3"/>
            </demo-line>
            <demo-line>
                <pl-button :label="`hex值，开启透明度[${test4.option.value}]`" @click="test4.toggle()" ref="test4"/>
                <pl-button :label="`rgb值，开启透明度[${test5.option.value}]`" @click="test5.toggle()" ref="test5"/>
            </demo-line>
        </demo-row>
        <demo-row title="pl-color-picker">
            <pl-color-picker :value="val[0]"/>
            <pl-color-picker :value="val[0]"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "color-picker",
        props: {},
        data() {

            const newData = (name, option) => {
                let result = {
                    service: null,
                    option: {
                        value: null,
                        reference: () => this.$refs[name],
                        on: {
                            change: (val) => {
                                this.$message(val)
                                result.option.value = val
                            },
                        },
                        ...option,
                    },
                    toggle: async () => {
                        if (!result.service) {
                            result.service = await this.$plain.$cs(result.option)
                        }
                        result.service.toggle()
                    },
                }
                return result
            }

            // 无初始值
            const test0 = newData('test0', {})
            // hex值
            const test1 = newData('test1', {
                value: '#ff0000',
            })

            // rgb值
            const test2 = newData('test2', {
                // enableAlpha: true,
                // format: 'rgb',
                value: 'rgba(1,1,1)',
            })

            // rgba值
            const test3 = newData('test3', {
                value: 'rgba(59,135,111,0.50)',
            })

            // hex值，开启透明度
            const test4 = newData('test4', {
                value: '#ff0000',
                enableAlpha: true,
            })
            // rgb值，开启透明度
            const test5 = newData('test5', {
                value: 'rgb(234,345,456)',
                enableAlpha: true,
            })

            return {
                color1: '#ee2356',
                color2: null,

                test0,
                test1,
                test2,
                test3,
                test4,
                test5,

                val: {
                    0: '#ee2356',
                },
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>