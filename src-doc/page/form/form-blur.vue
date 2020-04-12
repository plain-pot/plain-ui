<template>
    <div class="form-blur">
        <demo-row title="基本用法">
            <pl-form ref="form" v-model="form1.formData" contentWidth="400px" :disabled="disabled">
                <pl-form-item label="普通文本框" field="field1" :rules="{required:true,trigger:'blur'}">
                    <pl-input v-model="form1.formData.field1"/>
                </pl-form-item>
                <pl-form-item label="普通文本域" field="field2" :rules="{required:true,trigger:'blur'}">
                    <pl-input v-model="form1.formData.field2" textarea/>
                </pl-form-item>

                <pl-form-item label="数字框" field="field3" :rules="{required:true,trigger:'blur'}">
                    <pl-number v-model="form1.formData.field3" :inputProps="{block:true}"/>
                    <pl-icon icon="el-icon-question" slot="suffix" v-tooltip="'提示'"/>
                </pl-form-item>

                <pl-form-item label="下拉选项" field="field6" :rules="{required:true,trigger:'blur'}">
                    <pl-select :data="levelData" labelKey="levelName" valueKey="code" v-model="form1.formData.field6"/>
                </pl-form-item>
                <pl-form-item label="级联选择" field="field61" :rules="{required:true,trigger:'blur'}">
                    <pl-cascade :data="treeData" labelField="name" keyField="id" childrenField="subs" v-model="form1.formData.field61" @focus="$plain.log('focus')" @blur="$plain.log('blur')"/>
                </pl-form-item>

                <pl-form-item label="开关按钮" field="field10" :rules="{required:true,trigger:'blur'}">
                    <pl-toggle v-model="form1.formData.field10"/>
                </pl-form-item>

                <pl-form-item label="颜色选择器" field="field14" :rules="{required:true,trigger:'blur'}">
                    <pl-color-picker v-model="form1.formData.field14" @focus="$plain.log('focus')" @blur="$plain.log('blur')"/>
                </pl-form-item>

                <pl-form-item label="时间选择" field="field15" :rules="{required:true,trigger:'blur'}">
                    <pl-time v-model="form1.formData.field15" @blur="$plain.log('blur')"/>
                </pl-form-item>
                <pl-form-item label="时间范围选择" :field="['field17','field18']" required>
                    <pl-time :start.sync="form1.formData.field17" :end.sync="form1.formData.field18" range/>
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
        <demo-row title="其他示例">

        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "form-blur",
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
                ],
                disabled: false,
            }
        },
        methods: {
            saveValidate() {
                this.$refs.form.validate((err) => {
                    if (!!err) {
                        console.log(err)
                        this.$refs.form.showError(err)
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