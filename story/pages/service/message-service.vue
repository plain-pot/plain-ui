<template>
    <div class="message-service">
        <demo-row title="基本用法">
            <pl-button @click="$message('提示信息！')" label="basically"/>
        </demo-row>
        <demo-row title="提示类型">
            <pl-button @click="$message.lite('提示信息！')" label="lite" style="background-color: white;border: solid 1px #ccc;color: #333"/>
            <pl-button @click="$message.dark('提示信息！')" label="dark" style="background-color: #333;border: none"/>
            <pl-button @click="$message.primary('提示信息！')" label="primary" status="primary"/>
            <pl-button @click="$message.success('提示信息！')" label="success" status="success"/>
            <pl-button @click="$message.warn('提示信息！')" label="warn" status="warn"/>
            <pl-button @click="$message.error('提示信息！')" label="error" status="error"/>
            <pl-button @click="$message.info('提示信息！')" label="help" status="info"/>
        </demo-row>
        <demo-row title="位置">
            <pl-button @click="$message('提示信息！',{horizontal:'start',vertical:'start'})" label="左上"/>
            <pl-button @click="$message('提示信息！',{horizontal:'center',vertical:'start'})" label="中上"/>
            <pl-button @click="$message('提示信息！',{horizontal:'end',vertical:'start'})" label="右上"/>
            <pl-button @click="$message('提示信息！',{horizontal:'start',vertical:'center'})" label="左中"/>
            <pl-button @click="$message('提示信息！',{horizontal:'center',vertical:'center'})" label="中中"/>
            <pl-button @click="$message('提示信息！',{horizontal:'end',vertical:'center'})" label="右中"/>
            <pl-button @click="$message('提示信息！',{horizontal:'start',vertical:'end'})" label="左下"/>
            <pl-button @click="$message('提示信息！',{horizontal:'center',vertical:'end'})" label="中下"/>
            <pl-button @click="$message('提示信息！',{horizontal:'end',vertical:'end'})" label="右下"/>
        </demo-row>
        <demo-row title="自定义关闭">
            <pl-button @click="$message('提示信息！',{time:1000,onClose:()=>log('close')})" label="一秒后自动关闭"/>
            <pl-button @click="$message('提示信息！',{time:null})" label="不自动关闭"/>
            <pl-button @click="$message('提示信息！',{onClose:()=>log('done')})" label="监听结束事件"/>
            <pl-button @click="$message('提示信息！',{onClick:()=>log('click')})" label="监听点击事件"/>
        </demo-row>
        <demo-row title="自定义内容">
            <pl-button @click="showCustom" label="show"/>
            {{text}}
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "message-service",
        data() {
            return {
                flag: true,
                text:'',
            }
        },
        methods: {
            async showMsg() {
                await this.$message({
                    message: '这个是自定义的消息'
                })
            },
            log(...args) {
                console.log(...args)
            },
            showCustom() {
                const option = this.$message({
                    status: 'lite',
                    render: () => (
                        <div>
                            <pl-input style="margin-right:10px;" v-model={this.text}/>
                            <pl-button label="close" mode="text" onClick={() => option.close()}/>
                        </div>
                    )
                })
            },
        },
    }
</script>

<style lang="scss">

</style>