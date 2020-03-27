<template>
    <div class="form-elements">
        <demo-row title="基本用法">
            <pl-form ref="form" v-model="form1.formData" contentWidth="400px" :disabled="disabled">
                <pl-form-item label="普通文本框" field="field1" required>
                    <pl-input v-model="form1.formData.field1"/>
                </pl-form-item>
                <pl-form-item label="普通文本域" field="field2" required>
                    <pl-input v-model="form1.formData.field2" textarea/>
                </pl-form-item>

                <pl-form-item label="数字框" field="field3" :rules="{max:100,message:'最大值100'}" required>
                    <pl-number v-model="form1.formData.field3" :inputProps="{block:true}"/>
                    <pl-icon icon="el-icon-question" slot="suffix" v-tooltip="'提示'"/>
                </pl-form-item>

                <pl-form-item label="复选框" field="field5" :rules="{min:1,max:2}" required>
                    <pl-checkbox-group v-model="form1.formData.field5" itemWidth="50%">
                        <pl-checkbox label="大客户" val="large"/>
                        <pl-checkbox label="潜在客户" val="potential"/>
                        <pl-checkbox label="长久客户" val="long"/>
                        <pl-checkbox label="赢单客户" val="order"/>
                    </pl-checkbox-group>
                </pl-form-item>

                <pl-form-item label="下拉选项" field="field6" :rules="{required:true,message:'只能选择二级', options:'2'}">
                    <pl-select :data="levelData" labelKey="levelName" valueKey="code" v-model="form1.formData.field6"/>
                </pl-form-item>

                <pl-form-item label="单选按钮组" field="field9" required>
                    <pl-radio-group v-model="form1.formData.field9" itemWidth="33%">
                        <pl-radio label="是" val="Y"/>
                        <pl-radio label="否" val="N"/>
                        <pl-radio label="未知" val="NO"/>
                    </pl-radio-group>
                </pl-form-item>
                <pl-form-item label="开关按钮" field="field10" :rules="{message:'请阅读并同意使用协议',options:true}">
                    <pl-toggle v-model="form1.formData.field10"/>
                </pl-form-item>

                <pl-form-item label="滑块" field="field11" required :rules="{min:50,message:'最小值50'}">
                    <pl-slider v-model="form1.formData.field11"/>
                </pl-form-item>
                <pl-form-item label="标签输入框" field="field12" required :rules="[{min:3,message:'最少输入3个标签'},{max:5,message:'最多5个标签'}]">
                    <pl-tag-input v-model="form1.formData.field12"/>
                </pl-form-item>

                <pl-form-item label="评分" field="field13" required :rules="{min:1,message:'最低1分'}">
                    <pl-rate v-model="form1.formData.field13"/>
                </pl-form-item>

                <pl-form-item>
                    <pl-button label="校验" @click="saveValidate"/>
                    <pl-button label="取消校验" mode="stroke" @click="$refs.form.clearValidate()"/>
                </pl-form-item>
                <pl-form-item>
                    <pl-button label="校验，不开启遮罩，自动loading按钮" @click="asyncSaveValidate" autoLoading/>
                </pl-form-item>

                <pl-form-item>
                    <pl-button :label="disabled?'启用':'禁用'" @click="disabled=!disabled" :disabled="false"/>
                </pl-form-item>
            </pl-form>
        </demo-row>
        <demo-row title="其他示例">

        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "form-elements",
        props: {},
        data() {
            return {
                form1: {
                    formData: {
                        field12: ['唐人街'],
                    },
                },

                levelData: [
                    {levelName: '一级', code: '1'},
                    {levelName: '二级', code: '2'},
                    {levelName: '三级', code: '3'},
                ],
                disabled: false,
            }
        },
        methods: {
            saveValidate() {
                this.$refs.form.validate((err) => {
                    if (!!err) {
                        this.$message.error(`校验不通过：${err.label || ''} ${err.message}`)
                    } else {
                        this.$message.success('校验通过')
                    }
                })
            },
            async asyncSaveValidate() {
                try {
                    await this.$refs.form.validateWithoutMask()
                    this.$message.success('校验通过')
                } catch (e) {
                    this.$message.error('请检查填写是否正确')
                }
            },
            async customValidator() {
                await this.$plain.utils.delay(2000)
                if (!this.form1.formData.field8) {
                    return '请先选择[父属性]'
                }
                if (this.form1.formData.field8 === '1' && this.form1.formData.field9 !== 'N') {
                    return '[父属性]为一级的时候只能选择否'
                }
                return null
            },
        },
    }
</script>

<style lang="scss">
</style>