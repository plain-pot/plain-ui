<template>
    <div class="demo-nav-page-1">
        <im-demo-row>
            <h2>页面一</h2>
        </im-demo-row>
        <im-demo-row title="下一页">
            <im-button label="下一页参数：" type="line"/>
            <im-input placeholder v-model="msg"/>
            <im-button label="打开页面二" @click="nav.push({path:'/nav/demo-nav-page-2',param:{msg:msg}})"/>
        </im-demo-row>
        <im-demo-row title="事件监听">
            <im-button label="监听事件" @click="nav.on('demo-event',e=>$message.show('页面一监听事件:'+e))"/>
            <im-button label="监听一次事件" @click="nav.once('demo-event',e=>$message.show('页面一监听一次事件:'+e))"/>
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

        <im-demo-row>
            <im-button label="打开页签" @click="nav.openTab({id:'???',title:'打开页签',path:'/nav/demo-nav-page-2',param:{msg:msg}})"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-nav-page-1",
        props: {
            nav: {},
        },
        data() {
            return {
                msg: null,
                message: '页面一事件参数：',
            }
        },
        methods: {
            onBack(e) {
                this.$notice.show({title: '监听到页面回退', message: e})
            },
        },
    }
</script>

<style lang="scss">

</style>