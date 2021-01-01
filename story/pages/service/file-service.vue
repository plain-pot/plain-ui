<template>
    <div class="file-service">
        <demo-row title="选择单个文件">
            <pl-button @click="getSingleFile" label="获取单个文件"/>
        </demo-row>
        <demo-row title="其他">
            <pl-button @click="getSingleFile({multiple:true})" label="获取多个文件"/>
            <pl-button @click="getSingleFile({max:5})" label="获取单个文件，最大5M"/>
            <pl-button @click="getSingleFile({max:5,multiple:true})" label="获取多个文件，最大5M"/>
            <pl-button @click="getSingleFile({max:5,multiple:true,accept:'image'})" label="获取多个文件，类型为图片"/>
            <pl-button @click="getSingleFile({max:5,multiple:true,accept:'excel'})" label="获取多个文件，类型为Excel文档"/>
            <pl-button @click="getSingleFile({max:5,multiple:true,accept:'image/png'})" label="获取多个文件，类型为自定义"/>
        </demo-row>
        <demo-row title="获取图片base64字符串">
            <pl-button label="获取图片之后展示图片" @click="showImage"/>
            <div>
                <img :src="base64" v-if="!!base64" class="image">
            </div>
        </demo-row>
        <demo-row title="获取文件，然后上传文件">
            <pl-button label="上传文件" @click="uploadFile"/>
            <pl-button label="上传多个文件" @click="uploadFiles"/>
        </demo-row>
    </div>
</template>

<script>
    import {$$file} from "../../../src/packages/file-service/file-service";

    export default {
        name: "file-service",
        data() {
            return {
                base64: null,
            }
        },
        methods: {
            async getSingleFile(option) {
                const file = await $$file.chooseFile(option)
                console.log('success', file)
            },
            async showImage() {
                const file = await $$file.chooseImage()
                const base64 = await $$file.readAsDataURL(file)
                this.base64 = base64
            },
            async uploadFile() {
                const file = await $$file.chooseFile()
                await $$file.upload({
                    action: 'http://193.112.75.134/server/upload/uploadFile',
                    file,
                    filename: 'file',
                    data: {
                        headId: '123',
                        module: 'single',
                    },
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
            async uploadFiles() {
                const file = await $$file.chooseFile({multiple: true})
                await $$file.upload({
                    action: 'http://193.112.75.134/server/upload/uploadFiles',
                    file,
                    filename: 'files',
                    data: {
                        headId: '456',
                        module: 'multiple',
                    },
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

</style>