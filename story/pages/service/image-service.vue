<template>
    <div class="demo-image-service">
        <demo-row title="获取图片文件">
            <pl-button @click="getImageFile()">获取单个文件</pl-button>
            <pl-button @click="getImageFile(true)">获取多个文件</pl-button>
        </demo-row>
        <demo-row title="压缩图片">
            <pl-button @click="testMeasureCompress">按照尺寸压缩</pl-button>
            <pl-button @click="testSizeCompress">按照容量压缩</pl-button>
            <img :src="compressData.before" v-if="compressData.before">
            <img :src="compressData.after" v-if="compressData.after">
        </demo-row>
        <demo-row title="预览图片">
            <demo-row title="预览单张图片">
                <img src="http://pic2.sc.chinaz.com/Files/pic/pic9/201908/hpic1329_s.jpg" @click="handlePreview('http://pic2.sc.chinaz.com/Files/pic/pic9/201908/hpic1329_s.jpg')">
            </demo-row>
            <demo-row title="预览多张图片">

            </demo-row>
        </demo-row>
    </div>
</template>

<script>

    import {Image} from 'plain-ui'

    export default {
        name: "image-service",
        data() {
            return {
                compressData: {
                    before: null,
                    after: null,
                },
            }
        },
        methods: {
            async getImageFile(multiple) {
                const data = await Image.$image.choose(multiple)
                const files = Array.isArray(data) ? data : [data]
                this.$notice(files.map(f => f.name).join(','))
            },
            async testMeasureCompress() {
                const before = await this.$$file.readAsDataURL(await Image.$image.choose())
                const config = await new Promise((resolve) => {
                    const state = {
                        maxHeight: null,
                        maxWidth: null,
                    }
                    const dialog = this.$dialog({
                        confirmButton: true,
                        cancelButton: true,
                        closeOnConfirm: false,
                        render: () => (<div>
                            <pl-form centerWhenSingleColumn={true}>
                                <pl-form-item label="最大高度">
                                    <pl-number v-model={state.maxHeight}/>
                                </pl-form-item>
                                <pl-form-item label="最大宽度">
                                    <pl-number v-model={state.maxWidth}/>
                                </pl-form-item>
                            </pl-form>
                        </div>),
                        onConfirm: () => {
                            if (!state.maxHeight && !state.maxWidth) {
                                return this.$message.error('最大宽度与最大高度不能同时为空！')
                            }
                            resolve(state)
                            dialog.close()
                        },
                    })
                })
                const after = await Image.$image.compress(before, config)
                this.compressData = {before: null, after}
            },
            async testSizeCompress() {
                const before = await this.$$file.readAsDataURL(await Image.$image.choose())
                const maxSize = await new Promise((resolve) => {
                    this.$dialog({
                        title: '最大存储（单位MB）',
                        editType: 'input',
                        onConfirm: resolve,
                        confirmButton: true,
                    })
                })
                const after = await Image.$image.compress(before, {maxSize})
                this.compressData = {before: null, after}
            },
            handlePreview(url) {
                Image.$image.preview(url)
            },
        },
    }
</script>

<style lang="scss">

</style>