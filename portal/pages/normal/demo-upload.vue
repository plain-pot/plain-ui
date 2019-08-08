<template>
    <div class="demo-upload">
        <im-demo-row title="基本用法">
            <im-upload
                    ref="upload"
                    v-model="fileList"
                    action="http://localhost:8989/upload/testUploadFileLimit2m"
                    multiplePickFile
                    :onSuccessUploadFile="onSuccessUploadFile"
                    :onErrorUploadFile="onErrorUploadFile">
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
                const uploadSize = this.$refs.upload.upload()
                if (uploadSize === 0) this.$message.show('已经上传完毕', {type: 'success'})
                else {
                    this.$message.show(`开始上传${uploadSize}个文件。`)
                }
            },
            async testUploadItem() {
                if (!this.fileList[0]) {
                    this.$message.show('无可上传文件')
                    return
                }
                const resp = await this.$refs.upload.uploadItem(this.fileList[0])
                console.log({...resp})
            },
            onSuccessUploadFile(file, data) {
                console.log({file, data})
                if (data.code !== 0) {
                    file.status = 'error'
                    this.$notice.show(`【${file.file.name}】上传失败，${data.ret}`, {type: 'error'})
                }
            },
            onErrorUploadFile(file, data) {
                console.log({file, data})
                this.$notice.show(`文件上传失败：${file.file.name}`, {type: 'error'})
            },
        }
    }
</script>

<style lang="scss">

</style>
