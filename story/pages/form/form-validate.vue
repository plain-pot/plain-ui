<template>
    <div class="form-validate">
        <demo-row title="111">
            <pl-form>
                <pl-form-item label="必填校验(失去焦点)" field="field2">
                    <pl-number v-model="form1.formData.field2" :inputProps="{block:true}" @blur="$message('blur')"/>
                    <template #suffix>
                        <pl-icon icon="el-icon-question" v-tooltip="'提示'"/>
                    </template>
                </pl-form-item>
            </pl-form>
        </demo-row>
        <demo-row title="基本用法">
            <pl-form ref="form"
                     v-model="form1.formData"
                     labelWidth="150px"
                     contentWidth="400px"

                     :rules="form1.formRules"
                     :associateFields="form1.associateFields"
                     :disabled="disabled"
            >
                <pl-form-item label="必填校验" field="field1" required>
                    <pl-input v-model="form1.formData.field1"/>
                </pl-form-item>

                <pl-form-item label="多字段校验" :field="['field20','field21']" required :rules="[
                        {field:'field20',min:3,message:'第一个输入框最少3个字符'},
                        {field:'field21',min:5,message:'第二个输入框最少5个字符'},
                    ]">
                    <pl-input v-model="form1.formData.field20"/>
                    &nbsp;至&nbsp;
                    <pl-input v-model="form1.formData.field21"/>
                </pl-form-item>

                <pl-form-item label="必填校验(失去焦点)" field="field2">
                    <pl-number v-model="form1.formData.field2" :inputProps="{block:true}" @blur="$message('blur')"/>
                    <template #suffix>
                        <pl-icon icon="el-icon-question" v-tooltip="'提示'"/>
                    </template>
                </pl-form-item>

                <pl-form-item label="字符长度校验 3-5" field="field3">
                    <pl-input v-model="form1.formData.field3"/>
                </pl-form-item>

                <pl-form-item label="form-item 设置校验规则" field="field4" :rules="{required:true,trigger:'blur'}">
                    <pl-input v-model="form1.formData.field4"/>
                </pl-form-item>

                <pl-form-item label="数组，1-2个选项" field="field5" :rules="{type:'array', min:1,max:2}" required>
                    <pl-checkbox-group v-model="form1.formData.field5" itemWidth="50%">
                        <pl-checkbox label="大客户" val="large"/>
                        <pl-checkbox label="潜在客户" val="potential"/>
                        <pl-checkbox label="长久客户" val="long"/>
                        <pl-checkbox label="赢单客户" val="order"/>
                    </pl-checkbox-group>
                </pl-form-item>

                <pl-form-item label="当复选框选项少于2个必填" field="field5_1" :rules="{validator:dynamicRequired}">
                    <pl-input v-model="form1.formData.field5_1"/>
                </pl-form-item>

                <pl-form-item label="选项校验：确定值" field="field6" :rules="{required:true,message:'只能选择二级', options:'2'}">
                    <pl-select v-model="form1.formData.field6">
                        <pl-select-option v-for="item in levelData" :label="item.levelName" :val="item.code" :key="item.code"/>
                    </pl-select>
                </pl-form-item>
                <pl-form-item label="选项校验：数组" field="field7" :rules="{required:true,message:'只能选择二级，三级', options:['2','3']}">
                    <pl-select v-model="form1.formData.field7">
                        <pl-select-option v-for="item in levelData" :label="item.levelName" :val="item.code" :key="item.code"/>
                    </pl-select>
                </pl-form-item>
                <pl-form-item label="父属性">
                    <pl-select v-model="form1.formData.field8">
                        <pl-select-option v-for="item in levelData" :label="item.levelName" :val="item.code" :key="item.code"/>
                    </pl-select>
                </pl-form-item>
                <pl-form-item label="自定义(异步2s)校验" field="field9" :rules="{validator:customValidator}">
                    <pl-radio-group v-model="form1.formData.field9" itemWidth="33%">
                        <pl-radio label="是" val="Y"/>
                        <pl-radio label="否" val="N"/>
                        <pl-radio label="未知" val="NO"/>
                    </pl-radio-group>
                </pl-form-item>
                <pl-form-item label="同意使用协议" field="field10" :rules="{message:'请阅读并同意使用协议',options:true,trigger:'blur'}">
                    <pl-toggle v-model="form1.formData.field10"/>
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
    </div>
</template>

<script>
    import {delay} from "plain-utils/utils/delay";

    export default {
        name: "form-validate",
        props: {},
        data() {
            return {
                form1: {
                    formData: {},

                    // 每一个field的规则可以是一个规则对象，也可以是规则对象数组
                    formRules: {
                        field2: {required: true, trigger: 'blur'},
                        field3: {required: true, min: 3, max: 5, trigger: 'change'},
                    },
                    associateFields: {
                        field5: ['field5_1'],
                        field20: 'field21',
                        field21: 'field20',
                    }
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
            async saveValidate() {
                const err = await this.$refs.form.validate()
                console.log('err', err)
                /*if (!!err) {
                    this.$refs.form.methods.showError(err)
                } else {
                    this.$message.success('校验通过')
                }*/
            },
            async asyncSaveValidate() {
                try {
                    await this.$refs.form.validateWithoutMask()
                    this.$message.success('校验通过')
                } catch (e) {
                    this.$message.error('请检查填写是否正确')
                }
            },
            async customValidator(rule, value, row) {
                console.log({
                    rule, value, row
                })
                await delay(Math.random() * 500 + 500)
                if (!row.field8) {
                    return '请先选择[父属性]'
                }
                if (row.field8 === '1' && row.field9 !== 'N') {
                    return '[父属性]为一级的时候只能选择否'
                }
                return null
            },

            dynamicRequired() {
                if (!this.form1.formData.field5 || this.form1.formData.field5.length < 2) {
                    if (!this.form1.formData.field5_1) {
                        return '当复选框选项少于5个时，field5_1必填'
                    }
                }
            },
        },
    }
</script>

<style lang="scss">
</style>