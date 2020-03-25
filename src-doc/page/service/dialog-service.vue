<template>
    <div class="dialog-service">
        <demo-row title="基本用法">
            <pl-button label="基本用法" @click="$dialog('Hello world')"/>
        </demo-row>
        <demo-row title="dialog参数，以及自定义内容">
            <pl-button label="基本用法" @click="customOption"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "dialog-service",
        props: {},
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
                            <pl-form>
                                <pl-form-item label="用户名">
                                    <pl-input onInput={val => username = val}/>
                                </pl-form-item>
                                <pl-form-item label="旧密码">
                                    <pl-input nativeProps={{type: "password"}} onInput={val => oldPwd = val}/>
                                </pl-form-item>
                                <pl-form-item label="新密码">
                                    <pl-input nativeProps={{type: "password"}} onInput={val => newPwd = val}/>
                                </pl-form-item>
                                <pl-form-item label="确认密码">
                                    <pl-input nativeProps={{type: "password"}} onInput={val => repeatPwd = val}/>
                                </pl-form-item>
                            </pl-form>
                        )
                    },
                })
            },
        },
    }
</script>

<style lang="scss">
</style>