<template>
    <div class="form-validate-mode">
        <pl-alert status="success" title="edit组件">
            以下简称 edit组件 为 “使用了useEdit组合函数进行控制的组件”，原生控件以及其他组件库的组件可以通过useEdit 函数封装变成edit组件；
        </pl-alert>
        <demo-row title="默认模式：form">
            <pl-form v-model="form1.formData" contentWidth="400px" ref="formMode">
                <pl-form-item label="标准文本框：必填" field="input" required>
                    <pl-input v-model="form1.formData.input"/>
                </pl-form-item>
                <pl-form-item label="标准下拉框：必填" field="select" required>
                    <pl-select v-model="form1.formData.select">
                        <pl-select-option v-for="item in levelData" :label="item.levelName" :val="item.code" :key="item.code"/>
                    </pl-select>
                </pl-form-item>
                <pl-form-item label="自定义组件：必填" field="custom" required>
                    <input v-model="form1.formData.custom"/>
                </pl-form-item>
                <pl-form-item label=" ">
                    <pl-button @click="validateFormMode" label="校验"/>
                </pl-form-item>
            </pl-form>
            <pl-alert title="validateMode = form">
                这种模式为表单模式，通过深度 watch model绑定的表单对象，来判断字段变化，然后自动触发 change 校验，这种模式的优点是，
                能够兼容所有的双向绑定表单组件，当然包括原生的表单控件。缺点是需要深度 watch表单对象，在表格中这种方式性能比较低。所以在表格中不采取这种方式
                触发change校验；
            </pl-alert>
        </demo-row>
        <demo-row title="表格模式：table">
            <pl-form v-model="form2.formData" contentWidth="400px" ref="tableMode" validateMode="table">
                <pl-form-item label="标准文本框：必填" field="input" required>
                    <pl-input v-model="form2.formData.input"/>
                </pl-form-item>
                <pl-form-item label="标准下拉框：必填" field="select" required>
                    <pl-select v-model="form2.formData.select">
                        <pl-select-option v-for="item in levelData" :label="item.levelName" :val="item.code" :key="item.code"/>
                    </pl-select>
                </pl-form-item>
                <pl-form-item label="自定义组件：必填" field="custom" required>
                    <input v-model="form2.formData.custom"/>
                </pl-form-item>
                <pl-form-item label=" ">
                    <pl-button @click="validateTableMode" label="校验"/>
                </pl-form-item>
            </pl-form>
            <pl-alert title="validateMode = table">
                这种模式为表格模式，通过监听form-item中，edit组件的change事件，来触发change校验。这种模式的优点是，
                能够精确地知道那个 form-item 的组件发生值绑定变化从而触发校验，缺点是，不兼容edit组件以外的其他组件，包括其他组件库的组件以及原生控件。
            </pl-alert>
            <pl-alert status="info">
                还有一个变化是，如果一个form-item的field是一个数组，就是校验多个字段的意思，当其中一个字段的值变化了，那么form模式下只会触发这个变化的字段
                的相关校验，而table模式下，会触发form-item上field中所有字段的校验；
            </pl-alert>
            <pl-alert status="warn">
                无论何种模式下，blur校验只能是edit组件有效。
            </pl-alert>
            <pl-alert status="success">
                当调用 form 组件的 validate函数时，会触发所有校验，这个与是否为edit组件无关。
            </pl-alert>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "form-validate-mode",
        data() {
            return {
                form1: {
                    formData: {},
                },
                form2: {
                    formData: {},
                },
                levelData: [
                    {levelName: '一级', code: '1'},
                    {levelName: '二级', code: '2'},
                    {levelName: '三级', code: '3'},
                ],
            }
        },
        methods: {
            async validateFormMode() {
                const err = await this.$refs.formMode.methods.validate()
                if (!!err) {
                    this.$refs.formMode.methods.showError(err)
                } else {
                    this.$message.success('校验通过')
                }
            },
            async validateTableMode() {
                const err = await this.$refs.tableMode.methods.validate()
                if (!!err) {
                    this.$refs.tableMode.methods.showError(err)
                } else {
                    this.$message.success('校验通过')
                }
            },
        }
    }
</script>

<style lang="scss">
    .form-validate-mode {
        .pl-alert {
            margin: 10px 0;
        }
    }
</style>