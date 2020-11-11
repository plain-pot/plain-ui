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
        <demo-row title="自定义图标">
            <pl-button status="primary" @click="$notice('打开开发者工具预览示例！',{icon:'el-icon-tools',status:'success'})">基本</pl-button>
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
        <demo-row title="自定义内内容">
            <pl-button @click="customFoot">自定义底部内容</pl-button>
            <pl-button @click="customRender">自定义顶部，文本以及尾部内容</pl-button>
        </demo-row>
        <demo-row title="去除关闭按钮">
            <pl-button @click="$notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！',{noClose:true})">基本用法</pl-button>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "notice-service",
        methods: {
            customFoot() {
                const handler = {
                    delete: () => {
                        this.$message.error('删除');
                        notice.close()
                    },
                    reply: () => {
                        this.$message.error('回复');
                        notice.close()
                    }
                }
                const notice = this.$notice({
                    title: '自定义底部内容',
                    message: '你有一封未读消息！',
                    time: null,
                    renderFoot: () => <>
                        <pl-button label="删除" mode="stroke" size="mini" status="error" onClick={handler.delete}/>
                        <pl-button label="回复" size="mini" status="primary" onClick={handler.reply}/>
                    </>
                })
            },
            customRender() {
                this.$notice({
                    time: null,
                    renderHead: () => (
                        <div>
                            <pl-loading style="margin-right:16px" type="beta"/>
                            <span>正在加载中...</span>
                        </div>
                    ),
                    renderContent: () => (
                        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
                            <pl-icon icon="el-icon-upload" style="font-size:36px;color:#777"/>
                            <span>当前正在导入数据，请稍后等待！</span>
                        </div>
                    ),
                    renderFoot: () => <>
                        <pl-button label="取消导入" mode="stroke" size="mini" status="error"/>
                    </>
                })
            },
        }
    }
</script>

<style lang="scss">

</style>