<template>
    <div class="dialog-service">
        <demo-row title="基本用法">
            <pl-button label="基本用法" @click="$dialog('操作成功')"/>
        </demo-row>
        <demo-row title="提示状态">
            <pl-button :label="item" :status="item" @click="$dialog[item]('操作进行中')" v-for="item in status" :key="item"/>
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
                onConfirm:val=>$message(String(val)),
                confirmButton:true,
                cancelButton:true,
            })"/>
            <pl-button label="textarea" @click="$dialog({
                editType:'textarea',
                onConfirm:val=>$message(String(val)),
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
            <pl-button label="基本用法" @click="multiService"/>
        </demo-row>
    </div>
</template>

<script>
    import DemoMixins from "../components/DemoMixins";

    export default {
        name: "dialog-service",
        props: {},
        mixins: [DemoMixins],
        data() {
            return {}
        },
        methods: {
            customOption() {

                let username, oldPwd, newPwd, repeatPwd;

                this.$dialog({
                    confirmButton: true,
                    cancelButton: true,
                    onConfirm: () => this.$message(JSON.stringify({username, oldPwd, newPwd, repeatPwd})),
                    onCancel: () => this.$message('cancel'),

                    title: '确认提示',
                    horizontal: 'end',
                    transition: 'pl-transition-dialog-right',
                    fullHeight: true,
                    wrapperPadding: false,

                    render() {
                        return (
                            <pl-form centerWhenSingleColumn rules={{}}>
                                <pl-form-item label="用户名">
                                    <pl-input onInput={val => username = val}/>
                                </pl-form-item>
                                <pl-form-item label="旧密码">
                                    <pl-input nativeProps={{type: "password"}} onInput={val => oldPwd = val}/>
                                </pl-form-item>
                                <pl-form-item label="新密码">
                                    <pl-input nativeProps={{type: "password"}} onInput={val => newPwd = val}/>
                                </pl-form-item>
                                <pl-form-item label="确认密码" required field="repeatPwd">
                                    <pl-input nativeProps={{type: "password"}} onInput={val => repeatPwd = val}/>
                                </pl-form-item>
                            </pl-form>
                        )
                    },
                })
            },
            multiService() {
                const that = this
                let message = Math.random()
                this.$dialog({
                    render() {
                        return (
                            <div>
                                message:{message}
                                <div>
                                    <pl-button label="open another dialog service" onClick={() => that.multiService()}/>
                                </div>
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