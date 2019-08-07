<template>
    <div class="demo-upload">
        <im-demo-row title="基本用法">
            <im-upload multiplePickFile ref="upload" v-model="fileList">
                <im-button icon="pad-file" label="选择文件"/>
            </im-upload>
            <div>
                <im-button label="上传" @click="testUpload"/>
            </div>
            <div>
                <im-button label="上传item" @click="testUploadItem"/>
            </div>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-upload",
        data() {
            return {
                fileList: [
                    {id: '123', file: {name: 'demo1.txt'}},
                    {id: '456', file: {name: 'demo2.txt'}},
                ],
            }
        },
        methods: {
            testUpload() {
                console.log(this.$refs.upload.upload())
            },
            async testUploadItem() {
                if (!this.fileList[0]) {
                    this.$message.show('无可上传文件')
                    return
                }
                const resp = await this.$refs.upload.uploadItem(this.fileList[0])
                console.log({...resp})
            },
        }
    }
</script>

<style lang="scss">

</style>
