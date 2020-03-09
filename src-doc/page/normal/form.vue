<template>
    <div class="demo-form">
        <demo-row title="基本用法">
            <pl-form>
                <pl-form-item label="客户名称" field="name">
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="客户类型" field="name">
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="客户加入时间" field="name">
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="是否老客户" field="name">
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="客户性质" field="name">
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="客户级别" field="name">
                    <pl-input v-model="formData.name"/>
                </pl-form-item>
                <pl-form-item label="备注" field="name">
                    <pl-input v-model="formData.name"/>
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