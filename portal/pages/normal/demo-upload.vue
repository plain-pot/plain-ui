<template>
    <div class="demo-upload">
        <im-demo-row title="基本用法">
            <im-upload
                    ref="upload"
                    v-model="fileList"
                    v-bind="uploadProps"
                    multiplePickFile
                    :maxSize="10"
                    :onSuccessUploadFile="onSuccessUploadFile"
                    :onErrorUploadFile="onErrorUploadFile"
                    @clickItem="({item})=>selectFile = item">
                <im-button icon="pad-file" label="选择文件"/>
            </im-upload>
            <im-demo-row-item title="单独上传某个文件">
                <im-button label="上传" @click="testUploadItem"/>
                {{!!selectFile?selectFile.file.name:'未选择任何文件'}}
            </im-demo-row-item>
            <im-demo-row-item title="一次性上传文件">
                <im-button label="上传" @click="testUploadAll"/>
            </im-demo-row-item>
            <im-demo-row-item title="分开上传所有文件">
                <im-button label="上传" @click="testUploadSeparate"/>
            </im-demo-row-item>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-upload",
        data() {
            const multipleUploadProps = {
                action: 'http://localhost:8989/upload/testUploadFilesLimit2m',
                multipleUploadFile: true,
            }
            const separateUploadProps = {
                action: 'http://localhost:8989/upload/testUploadFileLimit2m',
                multipleUploadFile: false,
            }
            return {
                selectFile: null,
                fileList: [
                    {id: '123', name: 'demo1.txt'},
                    {id: '456', name: 'demo2.txt'},
                ],
                multipleUploadProps,
                separateUploadProps,

                uploadProps: separateUploadProps,
            }
        },
        methods: {
            async testUploadItem() {
                if (!this.selectFile) {
                    this.$message.show('请选择要上传的文件')
                    return
                }
                if (this.selectFile.status === 'success') {
                    this.$message.show('请选择未上传的文件')
                    return
                }
                this.$refs.upload.uploadItem(this.selectFile)
            },
            async testUploadAll() {
                this.uploadProps = this.multipleUploadProps
                await this.$plain.nextTick()
                const uploadSize = this.$refs.upload.upload()
                if (uploadSize === 0) this.$message.show('已经上传完毕', {type: 'success'})
                else
                    this.$message.show(`开始统一上传${uploadSize}个文件。`)

            },
            async testUploadSeparate() {
                this.uploadProps = this.separateUploadProps
                await this.$plain.nextTick()
                const uploadSize = this.$refs.upload.upload()
                if (uploadSize === 0) this.$message.show('已经上传完毕', {type: 'success'})
                else
                    this.$message.show(`开始分开上传${uploadSize}个文件。`)
            },
            onSuccessUploadFile(file, data) {
                console.log({file, data})
                if (data.code !== 0) {
                    file.status = 'error'
                    this.$notice.show(`上传失败，${data.ret}`, {type: 'error'})
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
