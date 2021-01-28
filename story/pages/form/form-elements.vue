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
                    <template #suffix>
                        <pl-icon icon="el-icon-question" v-tooltip="'提示'"/>
                    </template>
                </pl-form-item>

                <pl-form-item label="复选框" field="field5" :rules="{min:1,max:2}" required>
                    <pl-checkbox-group v-model="form1.formData.field5" itemWidth="50%">
                        <pl-checkbox checkboxForAll label="全部"/>
                        <pl-checkbox label="大客户" val="large"/>
                        <pl-checkbox label="潜在客户" val="potential"/>
                        <pl-checkbox label="长久客户" val="long"/>
                        <pl-checkbox label="赢单客户" val="order"/>
                    </pl-checkbox-group>
                </pl-form-item>

                <pl-form-item label="下拉选项" field="field6" required :rules="{message:'只能选择二级', options:'2'}">
                    <pl-select v-model="form1.formData.field6">
                        <pl-select-option v-for="item in levelData" :label="item.levelName" :val="item.code" :key="item.code"/>
                    </pl-select>
                </pl-form-item>
                <pl-form-item label="下拉选项:多选" field="field62" :rules="{required:true,min:1,message:'最少选择一项'}">
                    <pl-select v-model="form1.formData.field62" multiple>
                        <pl-select-option v-for="item in levelData" :label="item.levelName" :val="item.code" :key="item.code"/>
                    </pl-select>
                </pl-form-item>

                <pl-form-item label="级联选择" field="field61" :rules="{required:true,message:'不能为空'}">
                    <pl-cascade :data="treeData" labelField="name" keyField="id" childrenField="subs" v-model="form1.formData.field61"/>
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
                <pl-form-item label="颜色选择器" field="field14" :rules="{required:true,message:'颜色不能为空!'}">
                    <pl-color-picker v-model="form1.formData.field14"/>
                </pl-form-item>
                <pl-form-item label="时间选择" field="field15" required>
                    <pl-time v-model="form1.formData.field15"/>
                </pl-form-item>
                <pl-form-item label="时间范围选择" :field="['field17','field18']" required>
                    <pl-time v-model:start="form1.formData.field17" v-model:end="form1.formData.field18" range/>
                </pl-form-item>

                <pl-form-item label="日期时间选择" field="field19" required>
                    <pl-date v-model="form1.formData.field19"/>
                </pl-form-item>

                <pl-form-item label="日期时间范围选择" :field="['field20','field21']" required>
                    <pl-date v-model:start="form1.formData.field20" v-model:end="form1.formData.field21" range datetime/>
                </pl-form-item>

                <pl-form-item>
                    <pl-button label="校验" @click="saveValidate"/>
                    <pl-button label="取消校验" mode="stroke" @click="$refs.form.clearValidate()"/>
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
        name: "form-elements",
        props: {},
        data() {

            const treeData = [
                {
                    id: '1',
                    name: '一级 1',
                    subs: [
                        ...([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => ({
                            id: '1-' + index,
                            name: '二级 1-' + index,
                            subs: [{
                                id: `1-${index}-1`,
                                name: `三级 1-${index}-1`
                            }]
                        })))
                    ]
                }, {
                    id: '2',
                    name: '一级 2',
                    subs: [
                        ...([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => ({
                            id: '2-' + index,
                            name: '二级 2-' + index,
                            subs: [{
                                id: `2-${index}-1`,
                                name: `三级 2-${index}-1`
                            }]
                        })))
                    ]
                }, {
                    id: '3',
                    name: '一级 3',
                    subs: [{
                        id: '3-1',
                        name: '二级 3-1',
                        subs: [{
                            id: '3-1-1',
                            name: '三级 3-1-1'
                        }, {
                            id: '3-1-2',
                            name: '三级 3-1-2'
                        }]
                    }, {
                        id: '3-2',
                        name: '二级 3-2',
                        subs: [{
                            id: '3-2-1',
                            name: '三级 3-2-1'
                        }]
                    }]
                }]

            return {
                treeData,
                form1: {
                    formData: {
                        field12: ['唐人街'],
                    },
                },

                levelData: [
                    {levelName: '一级', code: '1'},
                    {levelName: '二级', code: '2'},
                    {levelName: '三级', code: '3'},
                    {levelName: '四级', code: '4'},
                    {levelName: '五级', code: '5'},
                    {levelName: '六级', code: '6'},
                    {levelName: '七级', code: '7'},
                    {levelName: '八级', code: '8'},
                    {levelName: '九级', code: '9'},
                    {levelName: '十级', code: '10'},
                ],
                disabled: false,
            }
        },
        methods: {
            async saveValidate() {
                await this.$refs.form.validate()
                this.$message.success('校验通过')
            },
            async asyncSaveValidate() {
                try {
                    await this.$refs.form.validate({autoLoading: false})
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
        },
    }
</script>

<style lang="scss">
</style>