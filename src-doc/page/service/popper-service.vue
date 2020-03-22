<template>
    <div class="popper-service">
        <demo-row title="基本用法">
            <pl-button @click="test1.toggle()" label="open popper" ref="test1"/>
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
            return {
                test1,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>