<template>
    <div class="popper-service">
        <demo-row title="基本用法">
            <pl-button @click="test1.toggle()" label="open popper" ref="test1"/>
        </demo-row>
        <demo-row title="popper参数">
            <pl-button @click="testPopper.toggle()" label="open popper" ref="testPopper"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "popper-service",
        props: {},
        data() {

            const newData = (name, option) => {
                let ret = {
                    service: null,
                    option: {
                        reference: () => {
                            return this.$refs[name]
                        },
                        ...option
                    },
                    toggle: async () => {
                        if (!ret.service) {
                            ret.service = await this.$popper(ret.option)
                        }
                        ret.service.toggle()
                    },
                }
                return ret
            }

            const test1 = newData('test1', {
                render() {
                    return (
                        <div>
                            Hello world
                        </div>
                    )
                },
            })

            const testPopper = newData('testPopper', {
                popperProps: {
                    placement: 'right-start',
                    width: '100px',
                    height: '200px',
                    transition: 'pl-transition-scale-y',
                },
                render() {
                    return (
                        <div>
                            <p>右固定</p>
                            <p>宽100px，高200px</p>
                            <p>纵向缩放动画</p>
                        </div>
                    )
                },
            })

            return {
                test1,
                testPopper,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>