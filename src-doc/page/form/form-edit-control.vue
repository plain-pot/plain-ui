<template>
    <div class="form-edit-control">
        <demo-row title="父子disabled以及readonly设置">
            <demo-line>
                <pl-checkbox v-model="flag.disabled" label="禁用"/>
                <pl-checkbox v-model="flag.readonly" label="只读"/>
            </demo-line>
            <pl-form :disabled="flag.disabled" :readonly="flag.readonly">
                <pl-form-item label="客户名称" field="name">
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="客户员工数量" field="type">
                    <pl-number v-model="formData.type"/>
                    <span slot="suffix"><pl-icon icon="el-icon-question" v-tooltip="'整数'"/></span>
                </pl-form-item>
                <pl-form-item label="客户加入时间" field="joinTime" :disabled="false">
                    <pl-input v-model="formData.joinTime"/>
                    <span>&nbsp;至&nbsp;</span>
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="是否老客户" field="oldFlag" :disabled="false">
                    <pl-radio-group v-model="formData.oldFlag" itemWidth="50%">
                        <pl-radio label="老客户" val="Y" disabled/>
                        <pl-radio label="非老客户" val="N"/>
                    </pl-radio-group>
                </pl-form-item>
                <pl-form-item label="客户性质" field="properties">
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
                <pl-form-item label="备注" field="comments">
                    <pl-input textarea v-model="formData.comments"/>
                </pl-form-item>
                <pl-form-item label=" ">
                    <pl-button mode="stroke" label="取消"/>
                    <pl-button label="保存"/>
                </pl-form-item>
            </pl-form>
        </demo-row>
        <demo-row title="通过disabledFields控制禁用">
            <pl-checkbox-group v-model="formDisabledFields">
                <pl-checkbox label="客户名称" val="name"/>
                <pl-checkbox label="客户员工数量" val="type"/>
                <pl-checkbox label="客户加入时间" val="joinTime"/>
                <pl-checkbox label="是否老客户" val="oldFlag"/>
                <pl-checkbox label="客户性质" val="properties"/>
                <pl-checkbox label="客户级别" val="level"/>
                <pl-checkbox label="备注" val="comments"/>
                <pl-checkbox label="禁用操作按钮" val="button"/>
            </pl-checkbox-group>
            <div style="margin: 12px 0">
                {{targetFormDisabledFields}}
            </div>
            <pl-form :disabledFields="targetFormDisabledFields">
                <pl-form-item label="客户名称" field="name">
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="客户员工数量" field="type">
                    <pl-input v-model="formData.type"/>
                    <span slot="suffix"><pl-icon icon="el-icon-question" v-tooltip="'整数'"/></span>
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
                <pl-form-item label="客户性质" field="properties">
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
                <pl-form-item label="备注" field="comments">
                    <pl-input textarea v-model="formData.comments"/>
                </pl-form-item>
                <pl-form-item label=" " field="button">
                    <pl-button mode="stroke" label="取消"/>
                    <pl-button label="保存"/>
                </pl-form-item>
            </pl-form>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "form-edit-control",
        props: {},
        data() {
            return {
                formData: {},
                levelData: [
                    {levelName: '一级', code: '1'},
                    {levelName: '二级', code: '2'},
                    {levelName: '三级', code: '3'},
                ],
                formDisabledFields: [],
                flag: {},
            }
        },
        computed: {
            targetFormDisabledFields() {
                return this.formDisabledFields.reduce((ret, item) => {
                    ret[item] = true
                    return ret
                }, {})
            },
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>