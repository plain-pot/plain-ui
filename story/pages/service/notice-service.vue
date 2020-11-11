<template>
    <div class="notice-service">
        <demo-row title="基本用法">
            <pl-button @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！')">基本用法</pl-button>
        </demo-row>
        <demo-row title="状态">
            <pl-button status="primary" @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{status:'primary'})">基本</pl-button>
            <pl-button status="success" @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{status:'success'})">成功</pl-button>
            <pl-button status="warn" @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{status:'warn'})">警告</pl-button>
            <pl-button status="error" @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{status:'error'})">失败</pl-button>
            <pl-button status="info" @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{status:'info'})">帮助</pl-button>
            <pl-button status="info" @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{status:null})">无状态</pl-button>
        </demo-row>
        <demo-row title="位置">
            <pl-button label="右上角" @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{title:'右上角',horizontal:'end',vertical:'start'})"/>
            <pl-button label="右下角" @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{title:'右下角',horizontal:'end',vertical:'end'})"/>
            <pl-button label="左上角" @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{title:'左上角',horizontal:'start',vertical:'start'})"/>
            <pl-button label="左下角" @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{title:'左下角',horizontal:'start',vertical:'end'})"/>
        </demo-row>
        <demo-row title="停留时间">
            <pl-button @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{title:'退出确认'})">默认3s</pl-button>
            <pl-button @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{title:'退出确认',time:1000})">停留1s</pl-button>
            <pl-button @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{title:'退出确认',time:null})">取消自动关闭</pl-button>
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