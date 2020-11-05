<template>
    <div class="message-service">
        <demo-row title="基本用法">
            <pl-button @click="$message('操作成功！')" label="basically"/>
        </demo-row>
        <demo-row title="提示类型">
            <pl-button @click="$message.lite('操作成功！')" label="lite"/>
            <pl-button @click="$message.dark('操作成功！')" label="dark"/>
            <pl-button @click="$message.primary('操作成功！')" label="primary" status="primary"/>
            <pl-button @click="$message.success('操作成功！')" label="success" status="success"/>
            <pl-button @click="$message.warn('操作成功！')" label="warn" status="warn"/>
            <pl-button @click="$message.error('操作成功！')" label="error" status="error"/>
            <pl-button @click="$message.info('操作成功！')" label="help" status="info"/>
        </demo-row>
        <demo-row title="位置">
            <pl-button @click="$message('操作成功！',{horizontal:'start',vertical:'start'})" label="左上"/>
            <pl-button @click="$message('操作成功！',{horizontal:'center',vertical:'start'})" label="中上"/>
            <pl-button @click="$message('操作成功！',{horizontal:'end',vertical:'start'})" label="右上"/>
            <pl-button @click="$message('操作成功！',{horizontal:'start',vertical:'center'})" label="左中"/>
            <pl-button @click="$message('操作成功！',{horizontal:'center',vertical:'center'})" label="中中"/>
            <pl-button @click="$message('操作成功！',{horizontal:'end',vertical:'center'})" label="右中"/>
            <pl-button @click="$message('操作成功！',{horizontal:'start',vertical:'end'})" label="左下"/>
            <pl-button @click="$message('操作成功！',{horizontal:'center',vertical:'end'})" label="中下"/>
            <pl-button @click="$message('操作成功！',{horizontal:'end',vertical:'end'})" label="右下"/>
        </demo-row>
        <demo-row>
            <pl-button @click="$message('操作成功！',{time:1000,onClose:()=>log('close')})" label="一秒后自动关闭"/>
            <pl-button @click="$message('操作成功！',{time:null})" label="不自动关闭"/>
            <pl-button @click="$message('操作成功！',{onClose:()=>log('done')})" label="监听结束事件"/>
            <pl-button @click="$message('操作成功！',{onClick:()=>log('click')})" label="监听点击事件"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "message-service",
        methods: {
            async showMsg() {
                await this.$message({
                    message: '这个是自定义的消息'
                })
            },
            log(...args) {
                console.log(...args)
            },
        },
    }
</script>

<style lang="scss">

</style>