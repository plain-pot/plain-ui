<template>
    <div>
        <div class="pl-img" :style="styles" @mouseenter="p_hover = true" @mouseleave="p_hover = false" :class="classes">
            <img :src="p_value" :alt="alt" height="100%" width="100%" class="pl-img-el" :style="imageStyles" @load="pl_imgLoad" @error="pl_imgError" @click="pl_clickImg">

            <!--加载图片状态-->
            <div class="pl-img-loading" v-if="status === STATUS.LOADING">
                <pl-loading color="white"/>
            </div>

            <!--图片为空状态-->
            <div class="pl-img-empty" v-else-if="status === STATUS.EMPTY" @click="pl_uploadNew">
                <slot name="empty">
                    <pl-icon icon="pad-camera" class="pl-icon-tag"/>
                </slot>
            </div>

            <!--图片加载失败状态-->
            <div class="pl-img-error" v-else-if="status === STATUS.ERROR" @click="pl_uploadNew">
                <slot name="error">
                    <pl-icon icon="pad-close-circle" class="pl-icon-tag pl-icon-error"/>
                </slot>
            </div>

            <div class="pl-img-uploading" v-else-if="status === STATUS.UPLOAD">
                <slot name="upload">
                    <im-progress-mini :value="uploadPercent" innerColor="black" :size="progressSize" reverse/>
                </slot>
            </div>

            <!--图片操作栏-->
            <transition name="pl-img-operator-animate">
                <div class="pl-img-operator" v-if="([STATUS.SUCCESS,STATUS.ERROR].indexOf(status)>-1) && !!p_hover">
                    <div class="pl-img-operator-item">
                        <pl-icon icon="pad-cloud-upload" hover @click.stop="pl_uploadNew"/>
                    </div>
                    <div class="pl-img-operator-item">
                        <pl-icon icon="pad-delete-fill" hover @click.stop="pl_delete"/>
                    </div>
                </div>
            </transition>
        </div>
        [{{status}}]
    </div>
</template>

<script>
    export default {
        name: "pl-img",
        props: {
            width: {type: String, default: '80px'},                                                         //图片宽度
            height: {type: String, default: '80px'},                                                        //图片高度
            alt: {type: String},                                                                            //图片文本
            value: {type: String,},                                                                         //图片路径
            accept: {type: String, default: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'},          //选择图片的类型
            ObjectFit: {type: String, default: 'cover'},                                                    //图片object-fit样式值
            ObjectPosition: {type: String, default: 'center'},                                              //图片object-position样式值
            uploadOption: {type: Object, require: true},                                                             //图片上传地址
        },
        data() {
            const STATUS = {
                EMPTY: 'EMPTY',
                LOADING: 'LOADING',
                SUCCESS: 'SUCCESS',
                ERROR: 'ERROR',
                UPLOAD: 'UPLOAD',
            }
            return {
                p_value: null,
                status: STATUS.EMPTY,
                STATUS,
                p_hover: false,
                uploadPercent: 0,
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(val) {
                    this.p_value = val
                    this.changeStatus(!!val ? this.STATUS.LOADING : this.STATUS.EMPTY)
                },
            },
        },
        computed: {
            classes() {
                return [
                    `pl-img-status-${this.status.toLowerCase()}`
                ]
            },
            styles() {
                return {
                    height: this.height,
                    width: this.width,
                }
            },
            imageStyles() {
                return {
                    ObjectFit: this.ObjectFit,
                    ObjectPosition: this.ObjectPosition,
                }
            },
            progressSize() {
                const height = this.$plain.$utils.removePx(this.height)
                const width = this.$plain.$utils.removePx(this.width)
                const large = height > width ? height : width
                return large * 2
            },
        },
        methods: {
            changeStatus(status) {
                this.status = status
            },

            pl_imgLoad() {
                if (!/^(data:image\/)/.test(this.p_value)) this.changeStatus(this.STATUS.SUCCESS)
            },
            pl_imgError() {
                this.changeStatus(this.STATUS.ERROR)
            },

            async pl_uploadNew() {
                if (!this.uploadOption) {
                    throw new Error('uploadOption can be undefined!')
                }
                const file = await this.$file.getFile({accept: this.accept,})
                this.p_value = await this.$file.readAsDataURL(file)
                this.changeStatus(this.STATUS.UPLOAD)
                this.uploadPercent = 0

                const uploadOption = this.$plain.$utils.deepCopy(this.uploadOption)
                uploadOption.file = file
                const {onProgress: op, onSuccess: os, onError: oe} = uploadOption
                uploadOption.onProgress = (data) => {
                    !!op && op(data)
                    this.uploadPercent = data.percent
                    if (this.uploadPercent === 100) this.changeStatus(this.STATUS.LOADING)
                }
                uploadOption.onSuccess = async (data) => {
                    let flag = true
                    !!os && (flag = await os(data))
                    this.changeStatus(flag ? this.STATUS.SUCCESS : this.STATUS.ERROR)
                }
                uploadOption.onError = async (data) => {
                    let flag = false
                    !!oe && (flag = await oe(data))
                    this.changeStatus(flag ? this.STATUS.SUCCESS : this.STATUS.ERROR)
                }
                this.$file.upload(uploadOption)
            },
            pl_delete() {
                this.p_value = null
                this.changeStatus(this.STATUS.EMPTY)
                this.$emit('input', this.p_value)
            },

            pl_clickImg(index) {
                this.$img.preview([this.p_value])
            },
        }
    }
</script>

<style lang="scss">
    img[src=""], img:not([src]) {
        opacity: 0;
    }

    @include themeWrap {

        $img-border-color: #ddd;

        .pl-img {
            display: inline-block;
            position: relative;
            overflow: hidden;

            .pl-img-el {
                object-fit: cover;
                object-position: center;
                border-radius: plVar(borderFillet);
            }

            .pl-img-empty, .pl-img-loading, .pl-img-error, .pl-img-uploading {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .pl-img-loading {
                background-color: rgba(black, 0.25);
            }

            .pl-img-empty, .pl-img-error {
                border: dashed $img-border-color 1px;

                .pl-icon-tag {
                    font-size: 20px;
                    color: $img-border-color;
                }

                .pl-icon-error {
                    color: plVar(colorError) !important;
                }
            }

            .pl-img-error {
                border-color: plVar(colorError);
            }

            .pl-img-operator {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                top: 50%;
                background-color: rgba(black, 0.5);
                display: flex;

                .pl-img-operator-item {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
            }

            .pl-img-uploading {
                .pl-progress-mini {
                    opacity: 0.75;
                }
            }

            &:hover {
                cursor: pointer;

                .pl-img-empty {
                    border-color: plVar(colorPrimary);
                }

                .pl-icon-tag {
                    color: plVar(colorPrimary);
                    transition-property: transform;
                }
            }

            &.pl-img-status-error {
                img {
                    opacity: 0;
                }
            }
        }
    }

    .pl-img-operator-animate-enter-active, .pl-img-operator-animate-leave-active {
        transform: translateY(0);
        transition: transform 0.15s linear;
    }

    .pl-img-operator-animate-enter, .pl-img-operator-animate-leave-to {
        transform: translateY(100%);
    }
</style>
