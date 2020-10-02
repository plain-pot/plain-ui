<template>
    <div class="form-dynamic-items">
        <pl-form labelWidth="120px" ref="form" v-model="formData">
            <pl-form-item label="收件人邮箱" field="email">
                <pl-input v-model="formData.email"/>
            </pl-form-item>

            <pl-form-item v-for="(item,index) in formData.addressList"
                          :label="`收件人地址${index+1}`"
                          :field="`addressList.${index}.addr`"
                          :key="index"
                          :rules="{required:true,trigger:'blur'}"
            >
                <pl-input v-model="item.addr"/>
                <pl-button icon="el-icon-minus" style="margin-left: 1em" shape="round" mode="stroke" size="mini" @click="formData.addressList.splice(index,1)"/>
            </pl-form-item>

            <pl-form-item>
                <pl-button mode="stroke" label="取消"/>
                <pl-button label="保存" @click="save"/>
                <pl-button label="新增收件地址" @click="formData.addressList.push({})"/>
            </pl-form-item>
        </pl-form>
    </div>
</template>

<script>
    export default {
        name: "form-dynamic-items",
        data() {
            return {
                formData: {
                    addressList: [{addr: '湖南省长沙市天心区'}]
                },
            }
        },
        methods: {
            async save() {
                const validError = await this.$refs.form.methods.validate()
                if (!!validError) {
                    this.$refs.form.methods.showError(validError)
                } else {
                    this.$notice.success('校验通过')
                }
            },
        }
    }
</script>

<style lang="scss">

</style>