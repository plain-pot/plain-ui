<template>
    <div class="demo-form">
        <demo-row title="基本用法">
            <pl-form>
                <pl-form-item label="客户名称" field="name">
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="客户类型" field="type">
                    <pl-input v-model="formData.type"/>
                    <span slot="suffix">个</span>
                </pl-form-item>
                <pl-form-item label="客户加入时间" field="joinTime">
                    <pl-input v-model="formData.joinTime"/>
                    <span>&nbsp;至&nbsp;</span>
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="是否老客户" field="oldFlag">
                    <pl-radio-group v-model="formData.oldFlag">
                        <pl-radio label="是" val="Y"/>
                        <pl-radio label="否" val="N"/>
                    </pl-radio-group>
                </pl-form-item>
                <pl-form-item label="客户性质" field="properties">
                    <pl-checkbox-group v-model="formData.properties">
                        <pl-checkbox label="大客户" val="large"/>
                        <pl-checkbox label="潜在客户" val="potential"/>
                        <pl-checkbox label="长久客户" val="long"/>
                        <pl-checkbox label="赢单客户" val="order"/>
                    </pl-checkbox-group>
                </pl-form-item>
                <pl-form-item label="客户级别" field="level">
                    <pl-input v-model="formData.level"/>
                </pl-form-item>
                <pl-form-item label="备注" field="comments">
                    <pl-input textarea v-model="formData.comments"/>
                </pl-form-item>
                <pl-form-item lable=" ">
                    <pl-button mode="stroke" label="取消"/>
                    <pl-button label="保存"/>
                </pl-form-item>
            </pl-form>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-form",
        props: {},
        data() {
            return {
                formData: {},
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>