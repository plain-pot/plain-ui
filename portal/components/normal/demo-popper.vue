<template>
    <div class="demo-popper">
        <im-demo-row title="基本用法">
            <im-button label="show dom" @click="test1(1)" ref="button1"/>
            <div class="box-wrapper">
                <div class="box" ref="popper1">
                    <im-icon icon="pad-star"/>
                </div>
            </div>
        </im-demo-row>

        <im-demo-row title="方向以及对其方式">
            <im-button-group>
                <im-button type="line" label="方向"/>
                <im-button label="top" @click="direction = 'top'" :active="direction === 'top'"/>
                <im-button label="bottom" @click="direction = 'bottom'" :active="direction === 'bottom'"/>
                <im-button label="left" @click="direction = 'left'" :active="direction === 'left'"/>
                <im-button label="right" @click="direction = 'right'" :active="direction === 'right'"/>
            </im-button-group>
            <im-button-group>
                <im-button type="line" label="对其方式"/>
                <im-button label="start" @click="align = 'start'" :active="align === 'start'"/>
                <im-button label="center" @click="align = 'center'" :active="align === 'center'"/>
                <im-button label="end" @click="align = 'end'" :active="align === 'end'"/>
            </im-button-group>
            <im-button :active="arrow" label="arrow" @click="arrow = !arrow"/>
            <im-button @click="test2(2)" ref="button2" label="toggle"/>
            <div class="box-wrapper">
                <div class="box" ref="popper2">
                    <im-icon icon="pad-star"/>
                    <im-button label="close" @click="!!popper[2] && popper[2].hide()"/>
                </div>
            </div>
        </im-demo-row>

        <im-demo-row title="测试内容绑定">
            <im-button label="show dom" @click="test1(3)" ref="button3"/>
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
            <im-button label="show dom" @click="test4(4)" ref="button4"/>
            <div class="box-wrapper">
                <div class="box" ref="popper4">
                    <im-icon icon="pad-star"/>
                </div>
            </div>
        </im-demo-row>
        <im-demo-row title="动画">
            <im-button label="drop" @click="test5(5)" ref="button5"/>
            <im-button label="scale" @click="test5(6)" ref="button6"/>
            <div class="box-wrapper">
                <div class="box" ref="popper5">
                    <im-icon icon="pad-star"/>
                </div>
            </div>
            <div class="box-wrapper">
                <div class="box" ref="popper6">
                    <im-icon icon="pad-star"/>
                </div>
            </div>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-popper",
        data() {
            return {
                text: '123456',
                popper: {},

                direction: 'bottom',
                align: 'start',
                arrow: true,
            }
        },
        methods: {
            async test1(num) {
                if (!this.popper[num]) this.popper[num] = await this.$plain.$popper.newPopper({
                    reference: this.$refs[`button${num}`],
                    popper: this.$refs[`popper${num}`],
                })
                this.popper[num].p_show ? this.popper[num].hide() : this.popper[num].show()
            },
            async test2(num) {
                if (!this.popper[num]) this.popper[num] = await this.$plain.$popper.newPopper({
                    reference: this.$refs[`button${num}`],
                    popper: this.$refs[`popper${num}`],
                    arrow: this.arrow,
                })
                this.popper[num].p_direction = this.direction
                this.popper[num].p_align = this.align
                this.popper[num].p_arrow = this.arrow
                this.popper[num].p_show ? this.popper[num].hide() : this.popper[num].show()
            },
            async test4(num) {
                if (!this.popper[num]) this.popper[num] = await this.$plain.$popper.newPopper({
                    reference: this.$refs[`button${num}`],
                    popper: this.$refs[`popper${num}`],
                    offset: 30,
                })
                this.popper[num].p_show ? this.popper[num].hide() : this.popper[num].show()
            },
            async test5(num) {
                if (!this.popper[num]) this.popper[num] = await this.$plain.$popper.newPopper({
                    reference: this.$refs[`button${num}`],
                    popper: this.$refs[`popper${num}`],
                    animate: num === 5 ? 'drop' : 'scale',
                })
                this.popper[num].p_show ? this.popper[num].hide() : this.popper[num].show()
            },
        }
    }
</script>

<style lang="scss">
    .demo-popper {
        @at-root .box {
            /*background-color: #f2f2f2;*/
            height: 300px;
            width: 250px;
            padding: 12px;
            border-radius: 4px;
        }
        .box-wrapper {
            display: none;
        }
    }

</style>