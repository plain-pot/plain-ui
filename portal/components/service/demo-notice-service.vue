<template>
    <div class="demo-notice-service">
        <im-demo-row title="基本用法">
            <im-button label="basically" @click="$notice.show('您有新的消息！')"/>
        </im-demo-row>
        <im-demo-row title="提示类型">
            <im-button @click="$notice.show('操作成功！',{type:'info'})" label="info" box-color="primary"/>
            <im-button @click="$notice.show('操作成功！',{type:'success'})" label="success" box-color="success"/>
            <im-button @click="$notice.show('操作成功！',{type:'warn'})" label="warn" box-color="warn"/>
            <im-button @click="$notice.show('操作成功！',{type:'error'})" label="error" box-color="error"/>
            <im-button @click="$notice.show('操作成功！',{type:'help'})" label="help" box-color="info"/>
        </im-demo-row>
        <im-demo-row title="位置">
            <im-button @click="$notice.show('操作成功！',{horizontal:'start',vertical:'start'})" label="左上"/>
            <im-button @click="$notice.show('操作成功！',{horizontal:'center',vertical:'start'})" label="中上"/>
            <im-button @click="$notice.show('操作成功！',{horizontal:'end',vertical:'start'})" label="右上"/>
            <im-button @click="$notice.show('操作成功！',{horizontal:'start',vertical:'center'})" label="左中"/>
            <im-button @click="$notice.show('操作成功！',{horizontal:'center',vertical:'center'})" label="中中"/>
            <im-button @click="$notice.show('操作成功！',{horizontal:'end',vertical:'center'})" label="右中"/>
            <im-button @click="$notice.show('操作成功！',{horizontal:'start',vertical:'end'})" label="左下"/>
            <im-button @click="$notice.show('操作成功！',{horizontal:'center',vertical:'end'})" label="中下"/>
            <im-button @click="$notice.show('操作成功！',{horizontal:'end',vertical:'end'})" label="右下"/>
        </im-demo-row>
        <im-demo-row title="关闭时间与不自动关闭">
            <im-button @click="$notice.show('操作成功！',{time:1000,done:()=>log('done')})" label="一秒后自动关闭"/>
            <im-button @click="dontAutoClose" label="不自动关闭"/>
        </im-demo-row>
        <im-demo-row title="标题">
            <im-button label="标题" @click="$notice.show('您有新的消息！',{title:'你有一份新的邮件信息'})"/>
        </im-demo-row>
        <im-demo-row title="不要标题栏">
            <im-button label="noHeader" @click="$notice.show('您有新的消息！',{noHeader:true})"/>
        </im-demo-row>
        <im-demo-row title="自定义渲染内容">
            <im-button label="renderFunc" @click="costumeRender"/>
            <im-input v-model="val"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-notice-service",
        data() {
            return {
                val: null,
            }
        },
        methods: {
            dontAutoClose() {
                this.msg = this.$notice.show('操作成功！', {
                    time: null,
                    click: () => {
                        console.log('click');
                    }
                })
            },
            costumeRender() {
                const that = this
                this.$notice.show(null, {
                    renderFunc(h) {
                        return (<im-input value={that.val} onInput={e => that.val = e}/>)
                    },
                    time: null,
                })
            },
        }
    }
</script>

<style lang="scss">

</style>