<template>
    <div class="demo-file">
        <im-demo-row title="基本用法">
            <im-button @click="getSingleFile" label="获取单个文件"/>
        </im-demo-row>
        <im-demo-row title="其他">
            <im-button @click="getSingleFile" label="获取多个文件"/>
            <im-button @click="getSingleFile({maxSize:5})" label="获取单个文件，最大5M"/>
            <im-button @click="getSingleFile({maxSize:5,multiple:true})" label="获取多个文件，最大5M"/>
            <im-button @click="getSingleFile({maxSize:5,multiple:true,fileType:'image'})" label="获取多个文件，类型为图片"/>
            <im-button @click="getSingleFile({maxSize:5,multiple:true,fileType:'excel'})" label="获取多个文件，类型为Excel文档"/>
            <im-button @click="getSingleFile({maxSize:5,multiple:true,fileType:'png'})" label="获取多个文件，类型为自定义"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-file",
        methods: {
            async getSingleFile(option) {
                const file = await this.$file.getFile(option || {})
                console.log('success', file)
            },
        }
    }
</script>

<style lang="scss">

</style>
