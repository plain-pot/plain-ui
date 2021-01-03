<template>
    <div class="demo-upload">
        <demo-row title="基础用法">
            <pl-upload
                    v-model="val[0]"
                    action="http://193.112.75.134/server/upload/uploadFile"
                    filename="file"
            />
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "upload",
        data() {
            return {
                val: {
                    0: [
                        {id: '001', name: 'logo.jpg', status: 'done'},
                        {id: '002', name: 'home.jpg', status: 'done'},
                        {id: '003', name: 'sketch.png', status: 'done'},
                    ],
                }
            }
        },
    }
</script>

<style lang="scss">

</style>