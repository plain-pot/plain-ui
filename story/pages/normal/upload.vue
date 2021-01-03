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

        <demo-row title="自定义上传：将多个文件分开上传，并且每一个文件需要选择一个类型">
            <h4>多文件上传</h4>
            <pl-upload
                    :autoUpload="false"
                    v-model="customUpload.val"
                    action="http://193.112.75.134/server/upload/uploadFiles"
                    filename="file"
                    :handleRemove="customUpload.handleRemove"
                    :handleUpload="customUpload.handleUpload"
                    :validator="customUpload.validator"

            >
                <template #default="{item,index}">
                    {{index+1}}、{{item.name}}--[{{item.file.data.businessType}}]
                </template>
                <template #button>
                    <pl-dropdown>
                        <pl-button width="188">
                            <span>业务类型：{{customUpload.businessType||'无'}}</span>
                            <pl-icon icon="el-icon-arrow-down"/>
                        </pl-button>
                        <template #popper>
                            <pl-dropdown-menu>
                                <pl-dropdown-option label="搜索" @click="customUpload.businessType = '搜索'" icon="el-icon-search"/>
                                <pl-dropdown-option label="排序" @click="customUpload.businessType = '排序'" icon="el-icon-sort"/>
                                <pl-dropdown-option label="删除" @click="customUpload.businessType = '删除'" icon="el-icon-folder-delete"/>
                            </pl-dropdown-menu>
                        </template>
                    </pl-dropdown>
                </template>
            </pl-upload>
        </demo-row>

    </div>
</template>

<script>
    import {$$file} from "../../../src/packages/file-service/file-service";

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
                },

                customUpload: {
                    val: [],
                    businessType: null,
                    handleRemove: () => {
                        console.log('调用接口删除后端文件')
                    },
                    handleUpload: async (files) => {
                        await Promise.all(files.map(file => $$file.upload({
                            action: 'http://193.112.75.134/server/upload/uploadFile',
                            filename: 'file',
                            file: file.file,
                            data: file.file.data,
                        })))
                    },
                    validator: (file) => {
                        const {businessType} = this.customUpload
                        if (!businessType) {
                            this.$notice.error('请先选择业务类型！')
                            return false
                        }
                        file.data = {businessType}
                        return true
                    },
                },
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