<template>
    <div class="demo-nav-page-2">
        <im-demo-row>
            <h2>页面二</h2>
        </im-demo-row>
        <im-demo-row>
            <im-button label="返回" @click="nav.back(backData)"/>
            <im-input v-model="backData"/>
        </im-demo-row>
        <im-demo-row title="上一页参数">
            <im-button :label="`页面参数:${param.msg}`" type="line"/>
        </im-demo-row>

        <im-demo-row title="下一页">
            <im-button label="下一页参数：" type="line"/>
            <im-input placeholder v-model="msg"/>
            <im-button label="打开页面三" @click="nav.push({path:'/nav/demo-nav-page-3',param:{msg:msg}})"/>
        </im-demo-row>

        <im-demo-row title="事件监听">
            <im-button label="监听事件" @click="nav.on('demo-event',e=>$message.show('页面二监听事件:'+e,{type:'white'}))"/>
            <im-button label="监听一次事件" @click="nav.once('demo-event',e=>$message.show('页面二监听一次事件:'+e,{type:'white'}))"/>
        </im-demo-row>

        <im-demo-row title="解除监听事件">
            <im-button label="解除监听事件" @click="nav.off('demo-event')"/>
        </im-demo-row>

        <im-demo-row title="派发事件">
            <im-input v-model="message"/>
            <im-button label="派发事件" @click="nav.emit('demo-event',message)"/>
        </im-demo-row>

        <im-demo-row title="全局派发事件，nav下可用">
            <im-button label="派发全局事件" @click="nav.emit('demo-event',message,true)"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-nav-page-2",
        props: {
            nav: {},
            param: {},
        },
        data() {
            return {
                msg: null,
                message: '页面二事件参数：',
                backData: '',
            }
        },
    }
</script>

<style lang="scss">

</style>