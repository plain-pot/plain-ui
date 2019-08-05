<template>
    <div class="pl-upload">
        <div class="pl-upload-reference" @click="pl_click">
            <slot></slot>
        </div>
        <slot name="list">
            <ul>
                <li v-for="(file,index) in p_value" :key="index">
                    <pl-icon icon="pad-file-text-fill" class="pl-upload-file-icon"/>
                    <span>{{file.name}}</span>
                </li>
            </ul>
        </slot>
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
            filename: {type: String, default: 'file'},              //文件上传的字段名称
            headers: {type: Object,},                               //请求头额外信息
            withCredentials: {type: Boolean,},                      //支持发送 cookie 凭证信息
            onProgress: {type: Function,},                          //文件上传进度百分比变化钩子
            onSuccess: {type: Function,},                           //文件上传成功钩子
            onError: {type: Function,},                             //文件上传失败钩子
            beforeUpload: {type: Function,},                        //文件上传之前的钩子
            afterUpload: {type: Function,},                         //文件上传之后的钩子
            value: {type: Array},                                   //双向绑定数组数据

            multipleUploadFile: {type: Boolean,},                   //是否批量上传文件
        },
        watch: {
            value: {
                immediate: true,
                handler(val) {
                    this.p_value = (val || [])
                },
            },
        },
        data() {
            return {
                p_value: null,
            }
        },
        methods: {
            async pl_click(e) {
                let data = await this.$file.getFile({
                    multiple: this.multiplePickFile,
                    accept: this.accept,
                    validFunc: this.pickValidFunc,
                    maxSize: this.maxSize,
                })
                data = this.$plain.$utils.typeOf(data) === 'array' ? data : [data]
                this.p_value.push(...data)
            },
        }
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-upload {
            display: inline-block;
            width: 300px;

            ul {
                margin: 0;
                padding: 0.5em 0;

                li {
                    list-style: none;
                    height: 28px;
                    display: flex;
                    align-items: center;

                    .pl-upload-file-icon {
                        margin-right: 0.5em;
                    }

                    &:hover {
                        cursor: pointer;
                        background-color: plVar(colorPrimaryLighter);
                    }
                }
            }
        }
    }
</style>
