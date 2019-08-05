<template>
    <div class="demo-file">
        <im-demo-row title="基本用法">
            <im-button @click="getSingleFile" label="获取单个文件"/>
        </im-demo-row>
        <im-demo-row title="其他">
            <im-button @click="getSingleFile" label="获取多个文件"/>
            <im-button @click="getSingleFile({maxSize:5})" label="获取单个文件，最大5M"/>
            <im-button @click="getSingleFile({maxSize:5,multiple:true})" label="获取多个文件，最大5M"/>
            <im-button @click="getSingleFile({maxSize:5,multiple:true,accept:'image'})" label="获取多个文件，类型为图片"/>
            <im-button @click="getSingleFile({maxSize:5,multiple:true,accept:'excel'})" label="获取多个文件，类型为Excel文档"/>
            <im-button @click="getSingleFile({maxSize:5,multiple:true,accept:'png'})" label="获取多个文件，类型为自定义"/>
        </im-demo-row>
        <im-demo-row title="获取图片base64字符串">
            <im-button label="获取图片之后展示图片" @click="showImage"/>
            <img :src="base64" v-if="!!base64" class="image">
        </im-demo-row>
        <im-demo-row title="获取文件，然后上传文件">
            <im-button label="上传文件" @click="uploadFile"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-file",
        data() {
            return {
                base64: null,
            }
        },
        methods: {
            async getSingleFile(option) {
                const file = await this.$file.getFile(option || {})
                console.log('success', file)
            },
            async showImage() {
                const file = await this.$file.getFile({accept: 'image'})
                const base64 = await this.$file.readAsDataURL(file)
                this.base64 = base64
            },
            async uploadFile() {
                const file = await this.$file.getFile()
                await this.$file.upload({
                    action: 'http://localhost:8989/upload/testUploadFile',
                    file,
                    filename: 'file',
                    onProgress(data) {
                        console.log('progress', data)
                    },
                    onSuccess(...args) {
                        console.log('success', ...args)
                    },
                    onError(...args) {
                        console.log('error', ...args)
                    },
                })
            },
        }
    }
</script>

<style lang="scss">
    .demo-file {
        .image {
            width: auto;
            height: 100px;
            display: block;
        }
    }
</style>
