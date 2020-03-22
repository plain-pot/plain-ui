<template>
    <div class="popper-service">
        <demo-row title="基本用法">
            <pl-button @click="test1.toggle()" label="open popper" ref="test1"/>
        </demo-row>
        <demo-row title="popper参数">
            <pl-button @click="testPopper.toggle()" label="open popper" ref="testPopper"/>
        </demo-row>
        <demo-row title="实例复用">
            <pl-button @click="instance1.toggle()" label="instance1" ref="instance1"/>
            <pl-button @click="instance2.toggle()" label="instance2" ref="instance2"/>
            <pl-button @click="instance3.toggle()" label="instance3" ref="instance3"/>
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

            const instance1 = newData('instance1', {
                render() {
                    return (
                        <div>
                            instance1
                        </div>
                    )
                },
            })
            const instance2 = newData('instance2', {
                render() {
                    return (
                        <div>
                            instance2
                        </div>
                    )
                },
            })
            const instance3 = newData('instance3', {
                render() {
                    return (
                        <div>
                            instance3
                        </div>
                    )
                },
            })

            return {
                test1,
                testPopper,
                instance1,
                instance2,
                instance3,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>