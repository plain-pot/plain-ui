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
                this.$dialog({
                    confirmButton: true,
                    cancelButton: true,
                    onConfirm: () => this.$message('confirm'),
                    onCancel: () => this.$message('cancel'),

                    title: '确认提示',
                    horizontal: 'end',
                    transition: 'pl-transition-dialog-right',
                    height: '100vh',
                    wrapperPadding: false,

                    render() {
                        return (
                            <pl-form>
                                <pl-form-item label="用户名">
                                    <pl-input/>
                                </pl-form-item>
                                <pl-form-item label="旧密码">
                                    <pl-input type="password"/>
                                </pl-form-item>
                                <pl-form-item label="新密码">
                                    <pl-input type="password"/>
                                </pl-form-item>
                                <pl-form-item label="确认密码">
                                    <pl-input type="password"/>
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