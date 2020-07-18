<template>
    <div class="form-validate-mode">
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

</style>