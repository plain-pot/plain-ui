<template>
    <div class="notice-service">
        <demo-row title="基本用法">
            <pl-button @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！')">基本用法</pl-button>
        </demo-row>
        <demo-row title="位置">
            <pl-button label="右上角" @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{title:'右上角',horizontal:'end',vertical:'start'})"/>
            <pl-button label="右下角" @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{title:'右下角',horizontal:'end',vertical:'end'})"/>
            <pl-button label="左上角" @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{title:'左上角',horizontal:'start',vertical:'start'})"/>
            <pl-button label="左下角" @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{title:'左下角',horizontal:'start',vertical:'end'})"/>
        </demo-row>
        <demo-row title="取消自动关闭">
            <pl-button @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{title:'退出确认',time:null})">基本用法</pl-button>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "notice-service"
    }
</script>

<style lang="scss">

</style>