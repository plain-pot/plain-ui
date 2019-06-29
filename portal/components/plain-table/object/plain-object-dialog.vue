<template>
    <pl-dialog title="请选择一行记录" v-model="show">
        <plain-table :optio="option"/>
    </pl-dialog>
</template>

<script>
    export default {
        name: "plain-object-dialog",
        data() {
            return {
                show: false,
            }
        },
        methods: {
            pick(option, onConfirm, onCancel) {

            },
        }
    }
</script>

<style lang="scss">

</style>
