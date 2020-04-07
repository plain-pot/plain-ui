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
            <pl-button :label="`基本用法[${test1.option.value}]`" @click="test1.toggle()" ref="test1"/>
            <pl-button :label="`透明度[${test2.option.value}]`" @click="test2.toggle()" ref="test2"/>
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

            const test1 = newData('test1', {
                value: '#ff0000',
            })

            const test2 = newData('test2', {
                enableAlpha: true,
                format: 'rgb',
            })

            return {
                color1: '#ee2356',
                color2: null,

                test1,
                test2,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>