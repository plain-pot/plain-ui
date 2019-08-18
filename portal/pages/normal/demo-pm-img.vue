<template>
    <div class="demo-pm-img">
        <pm-img :id.sync="formData.id" :src.sync="formData.src"/>
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
            this.formData = await this.$http.post('demoField/queryById', {id: '1157246983992246272'})
        }
    }
</script>

<style lang="scss">

</style>
