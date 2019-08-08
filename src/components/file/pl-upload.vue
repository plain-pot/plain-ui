<template>
    <div class="pl-upload">
        <div class="pl-upload-reference" @click="pl_clickReference">
            <slot></slot>
        </div>
        <slot name="list">
            <ul class="pl-upload-list">
                <transition-group name="pl-upload-item-right">
                    <li v-for="(item,index) in p_value" :key="item.id" class="pl-upload-item">
                        <pl-icon icon="pad-file-text" class="pl-upload-file-icon"/>
                        <div class="pl-upload-item-name">{{item.file.name}}</div>
                        <div class="pl-upload-item-icon-wrapper">
                            <pl-icon icon="pad-close" class="pl-upload-item-icon pl-upload-item-icon-close" @click.stop="pl_remove(item,index)" hover/>
                            <pl-icon icon="pad-check-circle" class="pl-upload-item-icon pl-upload-item-icon-success" v-if="item.status === 'success'"/>
                            <pl-icon icon="pad-close-circle" class="pl-upload-item-icon pl-upload-item-icon-error" v-if="item.status === 'error'"/>
                            <pl-progress-mini :value="item.percent" v-if="item.status === 'upload'"/>
                        </div>
                    </li>
                </transition-group>
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
                    this.p_value.forEach(item => !item.status && this.$set(item, 'status', 'success'))
                },
            },
        },
        data() {
            return {
                p_value: null,
            }
        },
        methods: {
            upload(item) {
                const ret = {
                    success: [],
                    error: [],
                    flag: false,
                    message: null,
                }
                let list = !!item ? [item] : this.p_value

                if (!list || list.length === 0) {
                    ret.message = 'upload list is empty!'
                    return ret
                }
                const uploadList = list.filter(item => !!item.status && item.status !== 'success')
                if (uploadList.length === 0) {
                    ret.flag = true
                    return ret
                }

                uploadList.forEach(item => {
                    this.uploadItem(item)
                })
            },
            uploadItem(item) {
                return new Promise((rs) => {
                    this.$set(item, 'status', 'upload')
                    this.$file.upload({
                        action: 'http://localhost:8989/upload/testUploadFile',
                        file: item.file,
                        filename: 'file',
                        data: this.param,
                        onProgress: (data) => {
                            console.log(data.percent)
                            this.$set(item, 'percent', data.percent - 0)
                        },
                        onSuccess: () => {
                            this.$set(item, 'status', 'success')
                            this.$message.show(`[${item.file.name}]上传成功！`, {type: 'success'})
                            rs()
                        },
                        onError: () => {
                            this.$set(item, 'status', 'error')
                            this.$message.show(`[${item.file.name}]上传失败！`, {type: 'error'})
                            rs()
                        },
                    })
                })
            },
            async pl_clickReference(e) {
                let data = await this.$file.getFile({
                    multiple: this.multiplePickFile,
                    accept: this.accept,
                    validFunc: this.pickValidFunc,
                    maxSize: this.maxSize,
                })
                data = this.$plain.$utils.typeOf(data) === 'array' ? data : [data]
                data.forEach((item, index) => {
                    setTimeout(() => this.p_value.push({
                        id: this.$plain.$utils.uuid(),
                        file: item,
                        status: 'normal',//normal,upload,success,error
                        percent: 0,
                    }), index * 50)
                })
                this.$emit('input', this.p_value)
            },
            pl_remove(item, index) {
                this.p_value.splice(index, 1)
                this.$emit('input', this.p_value)
            },
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-upload {
            display: inline-block;

            .pl-upload-list {
                margin: 0;
                padding: 0.5em 0;
                position: relative;

                .pl-upload-item {
                    width: 300px;
                    list-style: none;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    position: relative;
                    transition: all 0.15s linear;
                    user-select: none;

                    .pl-upload-file-icon {
                        margin-right: 0.5em;
                    }

                    .pl-upload-item-icon-wrapper {
                        width: plVar(iconSize);
                        height: plVar(iconSize);
                        position: relative;

                        .pl-upload-item-icon {
                            position: absolute;
                            top: 0;
                            left: 0;
                            transition-property: transform;

                            &.pl-upload-item-icon-success {
                                color: plVar(colorSuccess);
                                visibility: visible;
                            }

                            &.pl-upload-item-icon-error {
                                color: plVar(colorError);
                                visibility: visible;
                            }

                            &.pl-upload-item-icon-close {
                                visibility: hidden;
                            }
                        }

                        .pl-progress-mini {
                            position: absolute;
                            top: 0;
                            left: 0;
                        }
                    }


                    .pl-upload-item-name {
                        flex: 1;
                        overflow-x: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    &:hover {
                        .pl-upload-item-icon {
                            &.pl-upload-item-icon-success, &.pl-upload-item-icon-error {
                                visibility: hidden;
                            }

                            &.pl-upload-item-icon-close {
                                visibility: visible;
                            }
                        }

                        &:after {
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            left: -6px;
                            right: -6px;
                            border-radius: plVar(borderFillet);
                            content: '';
                            cursor: pointer;
                            background-color: plVar(colorPrimaryLighter);
                            z-index: -1;
                        }
                    }
                }
            }
        }
    }

    .pl-upload-item-right-leave-active {
        position: absolute !important;
    }

    .pl-upload-item-right-enter, .pl-upload-item-right-leave-to {
        opacity: 0;
        transform: translateX(2em);
    }


</style>
