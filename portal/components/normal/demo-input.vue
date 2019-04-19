<template>
    <div class="demo-input">
        <im-demo-row title="基本用法">
            <im-input/>
        </im-demo-row>
        <im-demo-row title="鼠标悬浮的时候自动获取焦点">
            <im-input focusOnHover/>
        </im-demo-row>
        <im-demo-row title="类型">
            <im-input type="fill"/>
            <im-input type="line"/>
            <im-input type="none"/>
        </im-demo-row>
        <im-demo-row title="颜色">
            <im-input v-for="color in ['primary','success','warn','error','info','disabled']" :key="color" :color="color"/>
        </im-demo-row>
        <im-demo-row title="大小">
            <im-input size="large"/>
            <im-input size="default"/>
            <im-input size="small"/>
        </im-demo-row>
        <im-demo-row title="形状">
            <im-input shape="round"/>
            <im-input shape="fillet"/>
            <im-input shape="none"/>
        </im-demo-row>
        <im-demo-row title="输入框类型">
            <im-input inputType="password" :value="123456"/>
        </im-demo-row>
        <im-demo-row title="图标">
            <im-input icon="pl-date-fill"/>
        </im-demo-row>
        <im-demo-row title="自定义删除动作">
            <im-input icon="pl-dropdown" @clear="$plain.log('clear')"/>
        </im-demo-row>
        <im-demo-row title="长输入框">
            <im-input long/>
        </im-demo-row>
        <im-demo-row title="加载中">
            <im-input loading type="fill"/>
            <im-input loading/>
            <im-input loading type="none"/>
        </im-demo-row>
        <im-demo-row title="节流以及回车等待">
            <im-input @enter="$plain.log('enter')"/>
            <im-input @enter="testWaiting"/>
        </im-demo-row>
        <im-demo-row title="键盘事件">
            <im-button-group>
                <im-button label="enter" type="line"/>
                <im-button label="space" type="line"/>
                <im-button label="esc" type="line"/>
                <im-button label="up" type="line"/>
                <im-button label="down" type="line"/>
                <im-button label="left" type="line"/>
                <im-button label="right" type="line"/>
            </im-button-group>
            <im-input
                    @enter="$plain.log('enter')"
                    @space="$plain.log('space')"
                    @esc="$plain.log('esc')"
                    @up="$plain.log('up')"
                    @down="$plain.log('down')"
                    @left="$plain.log('left')"
                    @right="$plain.log('right')"
            />
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-input",
        methods: {
            async testWaiting() {
                await this.$plain.$utils.delay(2000)
                console.log('enter:', new Date().getTime())
            },
        }
    }
</script>

<style lang="scss">
    .demo-input {
        /*background-color: #3B731D;*/
    }
</style>