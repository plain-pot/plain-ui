<template>
    <div class="form-associate-fields">
        <demo-row title="基本用法">
            <pl-form v-model="formData"
                     :associateFields="associateFields"
                     ref="formRef">
                <pl-form-item label="并列字段" :field="['address','addrDetail']" :rules="[
                    {field:'address',required:true,message:'省市县必填'},
                    {field:'addrDetail',required:true,message:'街道门牌号必填'},
                ]">
                    <pl-input v-model="formData.address" placeholder="省市县"/>
                    <span style="padding: 0 1em">~</span>
                    <pl-input v-model="formData.addrDetail" placeholder="街道门牌号"/>
                </pl-form-item>
                <br>
                <pl-form-item label="关联字段" field="parentValue">
                    <pl-select v-model="formData.parentValue" @change="onParentValueChange">
                        <pl-select-option label="选项一" val="val_1"/>
                        <pl-select-option label="选项二" val="val_2"/>
                        <pl-select-option label="选项三" val="val_3"/>
                    </pl-select>
                </pl-form-item>
                <pl-form-item v-if="!!formData.parentValue" field="childValue" required label="子字段">
                    <pl-input v-model="formData.childValue"/>
                </pl-form-item>

                <pl-form-item>
                    <pl-button label="校验" @click="execValidate"/>
                    <pl-button label="清除校验" mode="stroke" @click="clearValidate"/>
                </pl-form-item>
            </pl-form>
        </demo-row>
    </div>
</template>

<script>

    export default {
        name: 'form-associate-fields',
        data() {
            return {
                formData: {},
                associateFields: {
                    address: 'addrDetail',
                    addrDetail: 'address',

                    parentValue: 'childValue',
                },
            }
        },
        methods: {
            /*父字段值变化之后，重置子字段，让用户重新输入*/
            onParentValueChange() {
                this.formData = {
                    ...this.formData,
                    childValue: null,
                }
            },
            async execValidate() {
                await this.$refs.formRef.validate()
                this.$notice.success('校验通过！')
            },
            clearValidate() {
                this.$refs.formRef.clearValidate()
            },
        }
    }
</script>

<style lang="scss">
</style>