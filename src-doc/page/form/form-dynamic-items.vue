<template>
    <div class="form-dynamic-items">
        <pl-form labelWidth="120px">
            <pl-form-item label="收件人姓名" field="name">
                <pl-input v-model="formData.name"/>
            </pl-form-item>

            <pl-form-item v-for="(item,index) in formData.addressList" :label="`收件人地址${index+1}`" :field="`addressList.${index}.addr`" :key="index">
                <pl-input v-model="item.addr"/>
                <pl-button icon="el-icon-minus" style="margin-left: 1em" shape="round" mode="stroke" size="mini"/>
            </pl-form-item>

            <pl-form-item>
                <pl-button mode="stroke" label="取消"/>
                <pl-button label="保存"/>
                <pl-button/>
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
    }
</script>

<style lang="scss">

</style>