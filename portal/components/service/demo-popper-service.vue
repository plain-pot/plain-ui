<template>
    <div class="demo-popper-service">

        <im-demo-row title="基本用法">
        <im-button label="show dom" @click="test(1)" ref="button1"/>
        <im-button label="destroy" @click="popper[1].destroy()"/>
        <div>
        <div class="box" ref="popper1" style="padding: 12px;border-radius: 4px">
        <im-icon icon="pad-star"/>
        <im-button label="popper content" icon="pad-search"/>
        </div>
        </div>
        </im-demo-row>

        <im-demo-row title="方向以及对其方式">
        <im-button-group>
        <im-button type="line" label="方向"/>
        <im-button label="top" @click="option[2].direction = 'top'" :active="option[2].direction === 'top'"/>
        <im-button label="bottom" @click="option[2].direction = 'bottom'" :active="option[2].direction === 'bottom'"/>
        <im-button label="left" @click="option[2].direction = 'left'" :active="option[2].direction === 'left'"/>
        <im-button label="right" @click="option[2].direction = 'right'" :active="option[2].direction === 'right'"/>
        </im-button-group>
        <im-button-group>
        <im-button type="line" label="对其方式"/>
        <im-button label="start" @click="option[2].align = 'start'" :active="option[2].align === 'start'"/>
        <im-button label="center" @click="option[2].align = 'center'" :active="option[2].align === 'center'"/>
        <im-button label="end" @click="option[2].align = 'end'" :active="option[2].align === 'end'"/>
        </im-button-group>
        <im-button :active="option[2].arrow" label="arrow" @click="option[2].arrow = !option[2].arrow"/>
        <im-button @click="test(2)" ref="button2" label="toggle"/>
        <div class="box-wrapper">
        <div class="box" ref="popper2">
        <im-icon icon="pad-star"/>
        <im-button label="close" @click="!!popper[2] && popper[2].hide()"/>
        </div>
        </div>
        </im-demo-row>

        <im-demo-row title="测试内容绑定">
        <im-button label="show dom" @click="test(3)" ref="button3"/>
        <im-input v-model="text"/>
        <div class="box-wrapper">
        <div class="box" ref="popper3">
        <im-icon icon="pad-star"/>
        <im-button label="close" @click="!!popper[3] && popper[3].hide()"/>
        <im-input v-model="text"/>
        </div>
        </div>
        </im-demo-row>

        <im-demo-row title="设置间距">
        <im-button label="show dom" @click="test(4)" ref="button4"/>
        <div class="box-wrapper">
        <div class="box" ref="popper4">
        <im-icon icon="pad-star"/>
        </div>
        </div>
        </im-demo-row>
        <im-demo-row title="动画">
        <im-button label="drop" @click="test(5)" ref="button5"/>
        <im-button label="scale" @click="test(6)" ref="button6"/>
        <div class="box-wrapper">
        <div class="box" ref="popper5">
        <im-icon icon="pad-star"/>
        drop
        </div>
        </div>
        <div class="box-wrapper">
        <div class="box" ref="popper6">
        <im-icon icon="pad-star"/>
        scale
        </div>
        </div>
        </im-demo-row>

        <im-demo-row title="设置宽高">
        <im-button label="show dom" @click="test(7)" ref="button7"/>
        <div class="box-wrapper">
        <div class="box" ref="popper7">
        <im-icon icon="pad-star"/>
        </div>
        </div>
        </im-demo-row>
        <im-demo-row title="禁用与reference大小对其">
        <im-button label="show dom" @click="test(8)" ref="button8"/>
        <div class="box-wrapper">
        <div class="box" ref="popper8">
        <im-icon icon="pad-star"/>
        </div>
        </div>
        </im-demo-row>

        <im-demo-row title="测试单例使用">
            <im-button-group>
                <im-button label="one" @click="test(9)" ref="button9"/>
                <im-button label="destroy one" @click="popper[9].destroy()"/>
            </im-button-group>
            <im-button label="two" @click="test(10)" ref="button10"/>
            <im-button label="three" @click="test(11)" ref="button11"/>
            <im-button label="four" @click="test(12)" ref="button12"/>
            <div class="box-wrapper" attr="1">
                <div class="box box1" ref="popper9">
                    <im-icon icon="pad-star"/>
                    <span>one</span></div>
            </div>
            <div class="box-wrapper" attr="2">
                <div class="box box2" ref="popper10">
                    <im-icon icon="pad-star"/>
                    <span>two</span></div>
            </div>
            <div class="box-wrapper" attr="3">
                <div class="box box3" ref="popper11">
                    <im-icon icon="pad-star"/>
                    <span>three</span></div>
            </div>
            <div class="box-wrapper" attr="4">
                <div class="box box4" ref="popper12">
                    <im-icon icon="pad-star"/>
                    <span>four</span></div>
            </div>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-popper-service",
        data() {
            return {
                text: '123456',
                popper: {},

                option: {
                    1: {},
                    2: {
                        arrow: true,
                        direction: 'bottom',
                        align: 'start',
                        disabledHideOnClickOutside: true,
                        disabledEqual: true,
                    },
                    3: {},
                    4: {
                        offset: 30,
                    },
                    5: {
                        animate: 'drop'
                    },
                    6: {
                        animate: 'scale'
                    },
                    7: {
                        height: '200px',
                        width: '150px',
                    },
                    8: {
                        height: '200px',
                        width: '150px',
                        disabledEqual: true,
                    },

                }
            }
        },
        methods: {
            async test(num) {
                if (!this.option[num]) this.option[num] = {}
                if (!this.option[num].reference) this.option[num].reference = this.$refs[`button${num}`]
                if (!this.option[num].popper) this.option[num].popper = this.$refs[`popper${num}`]
                this.popper[num] = await this.$plain.$popper.getPopper(this.option[num])

                this.popper[num].p_show ? this.popper[num].hide() : this.popper[num].show()
            },
        }
    }
</script>

<style lang="scss">
    .demo-popper-service {
        @at-root .box {
            /*background-color: #f2f2f2;*/
            height: 150px;
            width: 250px;
            padding: 12px;
            border-radius: 4px;
        }
        .box-wrapper {
            /*display: none;*/
        }
    }

</style>