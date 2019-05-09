<template>
    <div class="demo-popover">
        <im-demo-row title="基本用法">
            <im-button ref="button1" label="toggle" @click="toggle(1)"/>
            <im-popover ref="popover1" :reference="reference[1]">
                这里是悬浮框内容
            </im-popover>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-popover",
        data() {
            return {
                reference: {},
            }
        },
        methods: {
            async toggle(num) {
                if (!this.reference[num]) {
                    this.$set(this.reference, num, this.$refs[`button${num}`])
                }
                await this.$plain.nextTick()
                this.$refs[`popover${num}`].$refs.popper.show()

            },
        },
    }
</script>

<style lang="scss">

</style>