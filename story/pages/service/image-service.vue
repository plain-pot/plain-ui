<template>
    <div class="demo-image-service">
        <demo-row title="获取图片文件">
            <pl-button @click="getImageFile()">获取单个文件</pl-button>
            <pl-button @click="getImageFile(true)">获取多个文件</pl-button>
        </demo-row>
    </div>
</template>

<script>

    import {Image} from 'plain-ui'

    export default {
        name: "image-service",
        methods: {
            async getImageFile(multiple) {
                const data = await Image.$image.choose(multiple)
                const files = Array.isArray(data) ? data : [data]
                this.$notice(files.map(f => f.name).join(','))
            },
        },
    }
</script>

<style lang="scss">

</style>