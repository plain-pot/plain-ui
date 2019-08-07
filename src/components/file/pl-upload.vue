<template>
    <div class="pl-upload">
        <div class="pl-upload-reference" @click="pl_click">
            <slot></slot>
        </div>
        <slot name="list">
            <ul class="pl-upload-list">
                <transition-group name="pl-upload-item-right">
                    <li v-for="(item,index) in p_value" :key="item.id" class="pl-upload-item">
                        <pl-icon icon="pad-file-text-fill" class="pl-upload-file-icon"/>
                        <div class="pl-upload-item-name">{{item.file.name}}</div>
                        <div class="pl-upload-item-icon">
                            <pl-icon icon="pad-close-circle-fill" class="pl-upload-item-icon-close" @click.stop="remove(item,index)" hover/>
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
                data.forEach((item, index) => {
                    setTimeout(() => this.p_value.push({id: this.$plain.$utils.uuid(), file: item}), index * 50)
                })
                this.$emit('input', this.p_value)
            },
            remove(item, index) {
                this.p_value.splice(index, 1)
                this.$emit('input', this.p_value)
            },
        }
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

                    .pl-upload-item-icon {
                        width: 2em;

                        .pl-upload-item-icon-close {
                            opacity: 0;
                            transition-property: transform;
                            cursor: pointer;
                        }
                    }

                    .pl-upload-item-name {
                        flex: 1;
                        overflow-x: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    &:hover {
                        .pl-upload-item-icon-close {
                            opacity: 1;
                        }

                        &:after {
                            position: absolute;
                            top: -3px;
                            bottom: -3px;
                            left: -3px;
                            right: -3px;
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
