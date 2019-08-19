<template>
    <div class="demo-pm-img">
        <pm-img :id.sync="formData.imgId" :src.sync="formData.imgPath" @change="handleChange"/>
        {{formData}}
    </div>
</template>

<script>
    export default {
        name: "demo-pm-img",
        data() {
            return {
                formData: {},
            }
        },
        async created() {
            this.formData = (await this.$http.post('demoField/queryOne', {id: '1157246983992246272'})).ret
            console.log({...this.formData})
        },
        methods: {
            async handleChange() {
                const {code, ret} = await this.$http.post('demoField/update', this.formData)
                if (code === 0) this.$message.show('保存成功！')
                else this.$notice.show('保存失败：' + ret)
            },
        }
    }
</script>

<style lang="scss">

</style>
