<template>
    <div class="form-validate">
        <demo-row title="基本用法">
            <pl-form ref="form" :rules="formRules" v-model="formData">
                <pl-form-item label="客户名称" field="name" required>
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="客户员工数量" field="type">
                    <pl-input v-model="formData.type"/>
                    <span slot="suffix"><pl-icon icon="el-icon-question"/></span>
                </pl-form-item>
                <pl-form-item label="客户加入时间" field="joinTime">
                    <pl-input v-model="formData.joinTime"/>
                    <span>&nbsp;至&nbsp;</span>
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="是否老客户" field="oldFlag">
                    <pl-radio-group v-model="formData.oldFlag" itemWidth="50%">
                        <pl-radio label="老客户" val="Y"/>
                        <pl-radio label="非老客户" val="N"/>
                    </pl-radio-group>
                </pl-form-item>
                <pl-form-item label="客户性质" field="properties" :rules="propertiesRules">
                    <pl-checkbox-group v-model="formData.properties" itemWidth="50%">
                        <pl-checkbox label="大客户" val="large"/>
                        <pl-checkbox label="潜在客户" val="potential"/>
                        <pl-checkbox label="长久客户" val="long"/>
                        <pl-checkbox label="赢单客户" val="order"/>
                    </pl-checkbox-group>
                </pl-form-item>
                <pl-form-item label="客户级别" field="level">
                    <pl-select :data="levelData" labelKey="levelName" valueKey="code" v-model="formData.level"/>
                </pl-form-item>
                <pl-form-item label="备注" field="comments" :rules="commentsRules">
                    <pl-input textarea v-model="formData.comments"/>
                </pl-form-item>
                <pl-form-item label=" ">
                    <pl-button mode="stroke" label="取消"/>
                    <pl-button label="保存" @click="save"/>
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
                formData: {},

                // 每一个field的规则可以是一个规则对象，也可以是规则对象数组
                formRules: {
                    name: [
                        {required: true, message: '请输入活动名称', trigger: 'change'},
                        {min: 3, max: 5, trigger: 'change'}
                    ],
                    type: {required: true, trigger: 'change'},
                },
                // formItem 的规则可以是一个规则对象，也可以是规则对象数组
                propertiesRules: {required: true, min: 1, max: 2, message: '请选择 1-2 个客户性质', trigger: 'change'},
                commentsRules: [
                    {required: true, message: '备注不能为空', trigger: 'change'},
                    {max: 10, message: '长度在 10 字符以下', trigger: 'change'}
                ],

                levelData: [
                    {levelName: '一级', code: '1'},
                    {levelName: '二级', code: '2'},
                    {levelName: '三级', code: '3'},
                ],
                formDisabledFields: [],
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