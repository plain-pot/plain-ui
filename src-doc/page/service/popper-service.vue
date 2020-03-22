<template>
    <div class="popper-service">
        <demo-row title="基本用法">
            <pl-button @click="open1" label="open popper" ref="btn1"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "popper-service",
        props: {},
        data() {
            return {}
        },
        methods: {
            open1() {
                this.$popper({
                    reference: this.$refs.btn1,
                    // $slots: [],
                    render: (h) => {
                        return (
                            <div>
                                hello
                            </div>
                        )
                    },
                })
            },
        },
    }
</script>

<style lang="scss">
</style>