<template>
    <div class="popper-service">
        <demo-row title="基本用法">
            <pl-button label="basic usage" @click="basicUsage.toggle" ref="basicUsage"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "popper-service",
        data() {
            const basicUsage = this.$popper({
                reference: () => this.$refs.basicUsage,
                render: () => (
                    <div>
                        自定义浮层内容
                    </div>
                )
            })

            return {
                basicUsage,
            }
        },
    }
</script>

<style lang="scss">

</style>