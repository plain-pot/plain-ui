<template>
    <div class="form-validate">
        <demo-row title="基本用法">
            <pl-form ref="form" :rules="form1.formRules" v-model="form1.formData">
                <pl-form-item label="必填校验" field="field1" required>
                    <pl-input v-model="form1.formData.field1"/>
                </pl-form-item>

                <pl-form-item label="必填校验(失去焦点)" field="field2">
                    <pl-input v-model="form1.formData.field2"/>
                </pl-form-item>

                <pl-form-item label="字符长度校验 3-5" field="field3">
                    <pl-input v-model="form1.formData.field3"/>
                </pl-form-item>

                <pl-form-item label="form-item 设置校验规则" field="field4" :rules="{required:true,trigger:'blur'}">
                    <pl-input v-model="form1.formData.field4"/>
                </pl-form-item>

                <pl-form-item label="数组，1-2个选项" field="field5" :rules="{min:1,max:2}">
                    <pl-checkbox-group v-model="form1.formData.field5" itemWidth="50%">
                        <pl-checkbox label="大客户" val="large"/>
                        <pl-checkbox label="潜在客户" val="potential"/>
                        <pl-checkbox label="长久客户" val="long"/>
                        <pl-checkbox label="赢单客户" val="order"/>
                    </pl-checkbox-group>
                </pl-form-item>

                <pl-form-item label="选项校验：确定值" field="field6" :rules="{required:true,message:'只能选择二级', options:'2'}">
                    <pl-select :data="levelData" labelKey="levelName" valueKey="code" v-model="form1.formData.field6"/>
                </pl-form-item>
                <pl-form-item label="选项校验：数组" field="field7" :rules="{required:true,message:'只能选择二级，三级', options:['2','3']}">
                    <pl-select :data="levelData" labelKey="levelName" valueKey="code" v-model="form1.formData.field7"/>
                </pl-form-item>

                <!--<pl-form-item label="自定义异步校验" field="field7">
                    <pl-radio-group v-model="form1.formData.field7" itemWidth="50%">
                        <pl-radio label="老客户" val="Y"/>
                        <pl-radio label="非老客户" val="N"/>
                    </pl-radio-group>
                </pl-form-item>-->

                <pl-form-item>
                    <pl-button label="校验" @click="$refs.form.validate()"/>
                    <pl-button label="取消校验" mode="stroke" @click="$refs.form.clearValidate()"/>
                </pl-form-item>
            </pl-form>
        </demo-row>
    </div>
</template>

<script>
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
                },

                levelData: [
                    {levelName: '一级', code: '1'},
                    {levelName: '二级', code: '2'},
                    {levelName: '三级', code: '3'},
                ],
            }
        },
        methods: {
            save() {
                console.log({
                    rules: this.$refs.form.rules,
                    allRules: this.$refs.form.allRules,
                    validateResults: this.$refs.form.p_validateResult
                })
            },
        },
    }
</script>

<style lang="scss">
</style>