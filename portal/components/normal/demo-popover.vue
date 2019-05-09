<template>
    <div class="demo-popover">
        <im-demo-row title="基本用法">
            <im-button ref="button1" label="toggle" @click="toggle(1)"/>
            <im-popover ref="popover1" :reference="reference[1]">
                <div class="demo-popover-box">
                    这里是悬浮框内容
                </div>
            </im-popover>
        </im-demo-row>

        <im-demo-row title="测试popper,scroll参数选项">
            <im-button ref="button2" label="toggle" @click="toggle(2)"/>
            <im-popover ref="popover2" :reference="reference[2]" :popper="{disabledEqual:true,width:200,height:200,}" :scroll="{scrollX:true}">
                <div class="demo-popover-box">
                    这里是悬浮框内容
                </div>
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
    .demo-popover-box {
        height: 300px;
        width: 300px;
    }
</style>