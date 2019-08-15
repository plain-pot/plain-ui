<template>
    <div>
        <div class="pl-img" :style="styles" @mouseenter="p_hover = true" @mouseleave="p_hover = false">
            <img :src="p_value" :alt="alt" height="100%" width="100%" class="pl-img-el" :style="imageStyles" @load="pl_imgLoad" @error="pl_imgError" @click="pl_clickImg">

            <div class="pl-img-loading" v-if="status === STATUS.LOADING">
                <pl-loading color="white"/>
            </div>

            <div class="pl-img-empty" v-else-if="status === STATUS.EMPTY" @click="pl_uploadNew">
                <slot name="empty">
                    <pl-icon icon="pad-camera" class="pl-icon-camera"/>
                </slot>
            </div>

            <transition name="pl-img-operator-animate">
                <div class="pl-img-operator" v-if="status !== STATUS.EMPTY && status !== STATUS.LOADING && !!p_hover">
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
        },
        data() {
            const STATUS = {
                EMPTY: 'EMPTY',
                LOADING: 'LOADING',
                SUCCESS: 'SUCCESS',
                ERROR: 'ERROR',
            }
            return {
                p_value: null,
                status: STATUS.EMPTY,
                STATUS,
                p_hover: false,
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
        },
        methods: {
            changeStatus(status) {
                this.status = status
            },

            pl_imgLoad() {
                this.changeStatus(this.STATUS.SUCCESS)
            },
            pl_imgError() {
                this.changeStatus(this.STATUS.ERROR)
            },

            async pl_uploadNew() {
                const file = await this.$file.getFile({
                    accept: this.accept,
                })
                const dataURL = await this.$file.readAsDataURL(file)
                this.p_value = dataURL
            },
            pl_delete() {
                this.p_value = null
                this.changeStatus(this.STATUS.EMPTY)
                this.$emit('input', this.p_value)
            },

            pl_clickImg() {
                this.$message.show('预览图片！')
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

            .pl-img-empty, .pl-img-loading {
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

            .pl-img-empty {
                border: dashed $img-border-color 1px;

                .pl-icon-camera {
                    font-size: 20px;
                    color: $img-border-color;
                }
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

            &:hover {
                cursor: pointer;

                .pl-img-empty {
                    border-color: plVar(colorPrimary);
                }

                .pl-icon-camera {
                    color: plVar(colorPrimary);
                    transition-property: transform;
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
