<template>
    <div class="pl-upload" @click="pl_click">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "pl-upload",
        props: {
            accept: {type: String,},                                //选择的文件类型
            multiplePickFile: {type: Boolean,},                     //是否批量选择文件
            pickValidFunc: {type: Function},                        //选择文件的校验钩子函数
            maxSize: {type: Number},                                //选择文件的最大值

            action: {type: String,},                                //文件上传地址
            param: {type: Object, require: true},                   //上传额外参数
            headers: {type: Object,},                               //请求头额外信息
            withCredentials: {type: Boolean,},                      //支持发送 cookie 凭证信息
            filename: {type: String,},                              //上传文件字段名
            onProgress: {type: Function,},                          //文件上传进度百分比变化钩子
            onSuccess: {type: Function,},                           //文件上传成功钩子
            onError: {type: Function,},                             //文件上传失败钩子
            beforeUpload: {type: Function,},                        //文件上传之前的钩子
            afterUpload: {type: Function,},                         //文件上传之后的钩子
            value: {type: Array},                                   //双向绑定数组数据

            multipleUploadFile: {type: Boolean,},                   //是否批量上传文件
        },
        data() {

        },
        methods: {
            async pl_click(e) {
                const data = await this.$file.getFile({
                    multiple: this.multiplePickFile,
                    accept: this.accept,
                    validFunc: this.pickValidFunc,
                    maxSize: this.maxSize,
                })
                console.log(data)
            },
        }
    }
</script>

<style lang="scss">

</style>
