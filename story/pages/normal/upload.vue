<template>
    <div class="demo-upload">
        <demo-row title="单文件上传">
            <pl-upload
                    :multiple="false"
                    v-model="val.singleValue"
                    action="http://193.112.75.134/server/upload/uploadFile"
                    filename="file"
                    :handleRemove="handleRemove"
            />
        </demo-row>


        <demo-row title="多文件上传">
            <pl-upload
                    v-model="val[0]"
                    action="http://193.112.75.134/server/upload/uploadFiles"
                    filename="file"
                    :handleRemove="handleRemove"
            />
        </demo-row>

        <demo-row title="文件状态">
            <pl-upload v-model="val[1]"
                       action="http://193.112.75.134/server/upload/uploadFiles"
                       filename="file"
                       :handleRemove="handleRemove"
            />
        </demo-row>

        <demo-row title="拖拽上传">
            <pl-upload v-model="val[0]"
                       draggable
                       action="http://193.112.75.134/server/upload/uploadFiles"
                       filename="file"
                       :handleRemove="handleRemove"
            />
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "upload",
        data() {
            return {
                handleRemove: (file) => {
                    console.log('remove file', file)
                },
                val: {
                    0: [
                        {id: '001', name: 'logo.jpg',},
                        {id: '002', name: 'home.jpg',},
                        {id: '003', name: 'sketch.png',},
                    ],
                    1: [
                        {id: '000', name: '已完成.jpg',},
                        {id: '001', name: '上传成功.jpg', status: 'success'},
                        {id: '002', name: '准备就绪.jpg', status: 'ready'},
                        {id: '003', name: '上传失败.jpg', status: 'error'},
                        {id: '004', name: '正在上传.jpg', status: 'uploading'},
                        {id: '005', name: '已删除.jpg', status: 'remove'},
                    ],
                }
            }
        },
    }
</script>

<style lang="scss">

</style>