<template>
    <div class="dialog-service">
        <demo-row title="基本用法">
            <pl-button label="基本用法" @click="$dialog('操作成功')"/>
        </demo-row>
        <demo-row title="提示状态">
            <pl-button :label="item" :status="item" @click="$dialog[item]('操作进行中')" v-for="item in ['primary','success','warn','error','info']" :key="item"/>
        </demo-row>
        <demo-row title="去掉 状态 图标">
            <pl-button label="基本用法" @click="$dialog('操作成功',{status:null})"/>
        </demo-row>
        <demo-row title="dialog参数，以及自定义内容">
            <pl-button label="基本用法" @click="customOption"/>
        </demo-row>
        <demo-row title="输入对话框">
            <pl-button label="input" @click="$dialog({
                editType:'input',
                editValue:inputValue,
                onConfirm:val=>{inputValue = val;$message(String(val))},
                confirmButton:true,
                cancelButton:true,
            })"/>
            <pl-button label="textarea" @click="$dialog({
                editType:'textarea',
                editValue:inputValue,
                onConfirm:val=>{inputValue = val;$message(String(val))},
                confirmButton:true,
                cancelButton:true,
            })"/>
            <pl-button label="input readonly" @click="$dialog({
                editType:'input',
                editValue:'Hello world',
                editReadonly:true,
                onConfirm:val=>$message(String(val)),
                confirmButton:true,
                cancelButton:true,
            })"/>
            <pl-button label="textarea readonly" @click="$dialog({
                editType:'textarea',
                editValue:'Hello world',
                editReadonly:true,
                onConfirm:val=>$message(String(val)),
                confirmButton:true,
                cancelButton:true,
            })"/>
        </demo-row>

        <demo-row title="多实例">
            <pl-button label="基本用法" @click="multiService()"/>
        </demo-row>
    </div>
</template>

<script>

    export default {
        name: "dialog-service",
        props: {},
        data() {
            return {
                inputValue: '默认文本',
            }
        },
        methods: {
            customOption() {

                this.$dialog({
                    title: '确认提示',
                    horizontal: 'end',
                    transition: 'pl-transition-dialog-right',
                    fullHeight: true,
                    wrapperPadding: false,
                    render() {
                        return (
                            <pl-form centerWhenSingleColumn>
                                <pl-form-item label="用户名">
                                    <pl-input v-model={this.userInfo.username}/>
                                </pl-form-item>
                                <pl-form-item label="旧密码">
                                    <pl-input v-model={this.userInfo.password} nativeAttrs={{type: 'password'}}/>
                                </pl-form-item>
                            </pl-form>
                        )
                    },
                })
            },
            multiService(message = 1) {
                const option = this.$dialog({
                    render: () => {
                        return (
                            <div>
                                {`第${message}个实例`}
                                <pl-button label="close" onClick={() => option.close()} style="margin:0 8px"/>
                                <pl-button label="open another dialog" onClick={() => this.multiService(message + 1)}/>
                            </div>
                        )
                    },
                })
            },
        },
    }
</script>

<style lang="scss">
</style>