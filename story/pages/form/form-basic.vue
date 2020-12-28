<template>
    <div class="demo-form-basic">

        <demo-row title="基本用法">
            <pl-form>
                <pl-form-item label="客户名称" field="name">
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="客户员工数量" field="type">
                    <pl-number v-model="formData.type"/>
                    <template #sufix>
                        <pl-icon icon="el-icon-question" v-tooltip="'整数'"/>
                    </template>
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
                    <pl-select v-model="formData.level">
                        <pl-select-option v-for="item in levelData" :label="item.levelName" :val="item.code" :key="item.code"/>
                    </pl-select>
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

        <demo-row title="对齐方式">
            <pl-form>
                <pl-form-item label="文本对齐方式" contentAlign="space-between">
                    <pl-radio-group v-model="config.labelAlign">
                        <pl-radio label="左对齐" val="left"/>
                        <pl-radio label="居中对齐" val="center"/>
                        <pl-radio label="右对齐" val="right"/>
                    </pl-radio-group>
                </pl-form-item>
                <pl-form-item label="内容对齐方式">
                    <pl-radio-group v-model="config.contentAlign" itemWidth="50%">
                        <pl-radio label="flex-start" val="flex-start"/>
                        <pl-radio label="flex-end" val="flex-end"/>
                        <pl-radio label="center" val="center"/>
                        <pl-radio label="space-between" val="space-between"/>
                        <pl-radio label="space-around" val="space-around"/>
                        <pl-radio label="space-evenly" val="space-evenly"/>
                    </pl-radio-group>
                </pl-form-item>
            </pl-form>

            <pl-form :labelAlign="config.labelAlign" :contentAlign="config.contentAlign">
                <div style="border-top: solid 1px #ddd;margin: 20px 0;"></div>

                <pl-form-item label="客户名称" field="name">
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <FormItem label="客户员工数量" field="type">
                    <pl-number v-model="formData.type"/>
                    <template #suffix>
                        <pl-icon icon="el-icon-question" v-tooltip="'整数'"/>
                    </template>
                </FormItem>
                <pl-form-item label="客户加入时间" field="joinTime">
                    <pl-date v-model="formData.joinTime"/>
                    <span>&nbsp;至&nbsp;</span>
                    <pl-date v-model="formData.name"/>
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
                    <pl-select v-model="formData.level">
                        <pl-select-option v-for="item in levelData" :label="item.levelName" :val="item.code" :key="item.code"/>
                    </pl-select>
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

        <demo-row title="内联表单">
            <pl-form v-model="formData" inline>
                <pl-form-item label="用户名称">
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="生日">
                    <pl-date v-model="formData.date"/>
                </pl-form-item>
                <pl-form-item>
                    <pl-button icon="el-icon-search" label="查询"/>
                </pl-form-item>
            </pl-form>
        </demo-row>
    </div>
</template>

<script>

    import FormItem from '../../../src/packages/form/form-item'

    export default {
        name: "form-basic",
        components: {
            FormItem,
        },
        data() {
            return {
                formData: {},
                config: {},
                levelData: [
                    {levelName: '一级', code: '1'},
                    {levelName: '二级', code: '2'},
                    {levelName: '三级', code: '3'},
                ],
            }
        },
    }
</script>

<style lang="scss">

</style>