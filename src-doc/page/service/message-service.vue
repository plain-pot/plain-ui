<template>
    <div class="demo-message">
        <demo-row title="基本用法">
            <pl-button @click="$message('操作成功！')" label="basically"/>
        </demo-row>
        <demo-row title="提示类型">
            <pl-button @click="$message('操作成功！',{status:'white'})" label="white"/>
            <pl-button @click="$message('操作成功！',{status:'black',})" label="black"/>
            <pl-button @click="$message('操作成功！',{status:'primary'})" label="primary" status="primary"/>
            <pl-button @click="$message('操作成功！',{status:'success'})" label="success" status="success"/>
            <pl-button @click="$message('操作成功！',{status:'warn'})" label="warn" status="warn"/>
            <pl-button @click="$message('操作成功！',{status:'error'})" label="error" status="error"/>
            <pl-button @click="$message('操作成功！',{status:'info'})" label="help" status="info"/>
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
            <pl-button @click="$message('操作成功！',{time:1000,done:()=>$plain.log('done')})" label="一秒后自动关闭"/>
            <pl-button @click="$message('操作成功！',{time:null})" label="不自动关闭"/>
            <pl-button @click="$message('操作成功！',{done:()=>$message('done')})" label="监听结束事件"/>
            <pl-button @click="$message('操作成功！',{click:()=>$message('click')})" label="监听点击事件"/>
        </demo-row>
    </div>
</template>

<script>

    export default {
        name: "demo-message",
    }
</script>

<style lang="scss">

</style>