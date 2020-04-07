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
                <pl-color-panel v-model="color2" enableAlpha format="hex"/>
            </demo-line>
        </demo-row>
        <demo-row title="ColorService">
            <pl-button label="open" @click="test1.toggle()" ref="test1"/>
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
                        reference: () => this.$refs[name],
                        on: {
                            change: (val) => {
                                this.$message(val)
                                result.option.value = val
                            },
                        },
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

            const test1 = newData('test1')

            return {
                color1: '#218379',
                color2: null,

                test1,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>