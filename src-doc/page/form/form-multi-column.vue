<template>
    <div class="form-multi-column">
        <demo-row title="单列表单">
            <pl-form column="1">
                <pl-form-item label="客户名称" field="name">
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="客户员工数量" field="type" v-if="formData.oldFlag === 'Y'">
                    <pl-input v-model="formData.type"/>
                    <span slot="suffix"><pl-icon icon="el-icon-question"/></span>
                </pl-form-item>
                <pl-form-item label="客户加入时间" field="joinTime" v-if="formData.oldFlag === 'Y'">
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
                <pl-form-item label=" ">
                    <pl-button mode="stroke" label="取消"/>
                    <pl-button label="保存"/>
                </pl-form-item>
            </pl-form>
        </demo-row>
        <demo-row title="双列表单">
            <pl-form column="2">
                <pl-form-item label="客户名称" field="name">
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
                <pl-form-item label="客户级别" field="level">
                    <pl-select :data="levelData" labelKey="levelName" valueKey="code" v-model="formData.level"/>
                </pl-form-item>
                <pl-form-item label="备注" field="comments" block>
                    <pl-input textarea v-model="formData.comments"/>
                </pl-form-item>
                <pl-form-item label="是否老客户" field="oldFlag">
                    <pl-radio-group v-model="formData.oldFlag" itemWidth="50%">
                        <pl-radio label="老客户" val="Y"/>
                        <pl-radio label="非老客户" val="N"/>
                    </pl-radio-group>
                </pl-form-item>
                <pl-form-item/>
                <pl-form-item label=" ">
                    <pl-button mode="stroke" label="取消"/>
                    <pl-button label="保存"/>
                </pl-form-item>
            </pl-form>
        </demo-row>
        <demo-row title="三列表单">
            <pl-form column="3" contentWidth="300">
                <pl-form-item label="客户名称" field="name">
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
                <pl-form-item label="备注" field="comments" column="2">
                    <pl-input textarea v-model="formData.comments"/>
                </pl-form-item>
                <pl-form-item label=" ">
                    <pl-button mode="stroke" label="取消"/>
                    <pl-button label="保存"/>
                </pl-form-item>
            </pl-form>
        </demo-row>
        <demo-row title="四列表单">
            <pl-form column="4" contentWidth="240">
                <pl-form-item label="客户名称" field="name">
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
                <pl-form-item label="备注" field="comments" column="2">
                    <pl-input textarea v-model="formData.comments"/>
                </pl-form-item>
                <pl-form-item label=" ">
                    <pl-button mode="stroke" label="取消"/>
                    <pl-button label="保存"/>
                </pl-form-item>
            </pl-form>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "form-multi-column",
        props: {},
        data() {
            return {
                formData: {
                    oldFlag: 'Y',
                },
                levelData: [
                    {levelName: '一级', code: '1'},
                    {levelName: '二级', code: '2'},
                    {levelName: '三级', code: '3'},
                ],
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>