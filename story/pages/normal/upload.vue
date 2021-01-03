<template>
    <div class="demo-upload">
        <demo-row title="单文件上传">
            <pl-upload
                    :multiple="false"
                    :data="uploadData"
                    :headers="uploadHeaders"
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

        <demo-row title="选择特定类型的文件">
            <h4>内置的accept：excel（另一个是image）</h4>
            <pl-upload
                    accept="excel"
                    v-model="val[0]"
                    action="http://193.112.75.134/server/upload/uploadFiles"
                    filename="file"
                    :handleRemove="handleRemove"
            />
            <h4>自定义accept，选择png文件</h4>
            <pl-upload
                    accept="image/png"
                    v-model="val[0]"
                    action="http://193.112.75.134/server/upload/uploadFiles"
                    filename="file"
                    :handleRemove="handleRemove"
            />
        </demo-row>

        <demo-row title="选择文件的时候，校验文件">
            <h4>点击选择文件</h4>
            <pl-upload
                    v-model="val[0]"
                    action="http://193.112.75.134/server/upload/uploadFiles"
                    filename="file"
                    :handleRemove="handleRemove"
                    :validator="chooseFileValidator"
            />
            <h4>拖拽接收文件</h4>
            <pl-upload
                    draggable
                    v-model="val[0]"
                    action="http://193.112.75.134/server/upload/uploadFiles"
                    filename="file"
                    :handleRemove="handleRemove"
                    :validator="chooseFileValidator"
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
            <pl-upload
                    v-model="val[0]"
                    draggable
                    action="http://193.112.75.134/server/upload/uploadFiles"
                    filename="file"
                    :handleRemove="handleRemove"
            />
        </demo-row>

        <demo-row title="手动上传">
            <h4>单文件上传</h4>
            <pl-upload
                    :autoUpload="false"
                    :multiple="false"
                    :data="uploadData"
                    :headers="uploadHeaders"
                    v-model="val.singleValue"
                    action="http://193.112.75.134/server/upload/uploadFile"
                    filename="file"
                    :handleRemove="handleRemove"
            />
            <h4>多文件上传</h4>
            <pl-upload
                    :autoUpload="false"
                    v-model="val[0]"
                    action="http://193.112.75.134/server/upload/uploadFiles"
                    filename="file"
                    :handleRemove="handleRemove"
            />
        </demo-row>

        <demo-row title="禁用上传">
            <h4>单文件上传</h4>
            <pl-upload
                    disabled
                    :multiple="false"
                    :data="uploadData"
                    :headers="uploadHeaders"
                    v-model="val.singleValue"
                    action="http://193.112.75.134/server/upload/uploadFile"
                    filename="file"
                    :handleRemove="handleRemove"
            />
            <h4>多文件上传</h4>
            <pl-upload
                    disabled
                    v-model="val[0]"
                    action="http://193.112.75.134/server/upload/uploadFiles"
                    filename="file"
                    :handleRemove="handleRemove"
            />
            <h4>多文件上传</h4>
            <pl-upload
                    draggable
                    disabled
                    v-model="val[0]"
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
                uploadData: {
                    level: '123',
                    orgCode: '001-123',
                },
                uploadHeaders: {
                    Authorization: '2781368215742187',
                },
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
                        {id: '004', name: '正在上传.jpg', status: 'uploading', percent: 78},
                        {id: '005', name: '已删除.jpg', status: 'remove'},
                    ],
                }
            }
        },
        methods: {
            chooseFileValidator(file) {
                const {name, calcSize} = file
                const filename = name.slice(0, name.lastIndexOf('.'))
                if (filename.length > 3) {
                    this.$notice.warn(`文件【${name}】校验不通过，文件名最大三个字符。`, {time: 5000})
                    return false
                }
                if (calcSize > 0.1) {
                    this.$notice.warn(`文件【${name}】校验不通过，文件大小超出 0.1 M`, {time: 5000})
                    return false
                }
            },
        }
    }
</script>

<style lang="scss">

</style>