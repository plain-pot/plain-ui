<template>
    <div class="pl-img" :style="styles" @mouseenter="p_hover = true" @mouseleave="p_hover = false" :class="classes">
        <img :src="p_value" :alt="alt" height="100%" width="100%" class="pl-img-el" :style="imageStyles" @load="pl_imgLoad" @error="pl_imgError" @click="pl_preview">

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
            <div class="pl-img-operator" v-if="([STATUS.SUCCESS,STATUS.ERROR].indexOf(status)>-1) && !!p_hover && !disabled">
                <div class="pl-img-operator-item">
                    <pl-icon icon="pad-cloud-upload" hover @click.stop="pl_uploadNew"/>
                </div>
                <div class="pl-img-operator-item">
                    <pl-icon icon="pad-delete-fill" hover @click.stop="pl_delete"/>
                </div>
            </div>
        </transition>
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
            uploadOption: {type: Object, require: true},                                                    //图片上传地址
            disabled: {type: Boolean},                                                                      //是否禁用
            customPreview: {type: Function},                                                                //自定义预览函数
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
                    `pl-img-status-${this.status.toLowerCase()}`,
                    {
                        'pl-img-disabled': this.disabled,
                    },
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
                if (!!this.disabled) return
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
                this.$emit('delete')
            },

            pl_preview() {
                if (!!this.customPreview) this.customPreview(this.p_value)
                else this.$img.preview([this.p_value])
            },
        }
    }
</script>

<style lang="scss">

</style>
