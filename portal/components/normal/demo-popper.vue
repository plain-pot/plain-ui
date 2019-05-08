<template>
    <div class="demo-popper">
        <im-demo-row title="基本用法">
            <im-button label="toggle" ref="btn1" @click="$refs.popper1.toggle()"/>
            <im-popper :reference="reference[1]" ref="popper1">
                <span>悬浮框内容</span>
            </im-popper>
        </im-demo-row>
        <im-demo-row title="调整间距offset=20">
            <im-button label="toggle" ref="btn3" @click="$refs.popper3.toggle()"/>
            <im-popper :reference="reference[3]" ref="popper3" :offset="20">
                <span>悬浮框内容</span>
            </im-popper>
        </im-demo-row>
        <im-demo-row title="动画">
            <im-button label="scale" ref="btn4" @click="$refs.popper4.toggle()"/>
            <im-popper :reference="reference[4]" ref="popper4" animate="scale">
                <span>悬浮框内容</span>
            </im-popper>
            <im-button label="drop" ref="btn5" @click="$refs.popper5.toggle()"/>
            <im-popper :reference="reference[5]" ref="popper5" animate="drop">
                <span>悬浮框内容</span>
            </im-popper>
        </im-demo-row>

        <im-demo-row title="自定义大小">
            <im-button label="toggle" ref="btn6" @click="$refs.popper6.toggle()"/>
            <im-popper :reference="reference[6]" ref="popper6" :height="300" :width="300" disabledEqual>
                <span>300x300</span>
            </im-popper>
        </im-demo-row>
        <im-demo-row title="禁用尺寸自动匹配">
            <im-button label="toggle" ref="btn7" @click="$refs.popper7.toggle()"/>
            <im-popper :reference="reference[7]" ref="popper7" disabledEqual>
                <span>disabledEqual</span>
            </im-popper>
        </im-demo-row>
        <im-demo-row title="禁用点击外部自动关闭">
            <im-button label="toggle" ref="btn8" @click="$refs.popper8.toggle()"/>
            <im-popper :reference="reference[8]" ref="popper8" disabledHideOnClickOutside>
                <span>disabledHideOnClickOutside</span>
            </im-popper>
        </im-demo-row>

        <im-demo-row title="方向，对其方式以及箭头(这里启用了【禁用尺寸自动匹配】以及【禁用点击外部自动关闭】功能)">
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
            <im-button label="toggle" ref="btn2" @click="$refs.popper2.toggle()"/>
            <im-popper :reference="reference[2]" ref="popper2" :arrow="arrow" :direction="direction" :align="align" disabledEqual disabledHideOnClickOutside>
                <span>悬浮框内容</span>
            </im-popper>
        </im-demo-row>

    </div>
</template>

<script>
    export default {
        name: "demo-popper",
        data() {
            return {
                reference: {},

                direction: 'bottom',
                align: 'start',
                arrow: true,
            }
        },
        mounted() {
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(index => {
                this.$set(this.reference, index, this.$refs[`btn${index}`])
            })
        },
        methods: {},

    }
</script>

<style lang="scss">
    .demo-popper {

    }

</style>