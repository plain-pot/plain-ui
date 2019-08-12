<template>
    <div class="pl-img" :style="styles" @click="pl_click">
        <img :src="p_src" :alt="alt" height="100%" width="100%" class="pl-img-el" :style="imageStyles" @load="pl_imgLoad" @error="pl_imgError">
        <div class="pl-img-empty">
            <slot name="empty">
                <pl-icon icon="pad-camera" class="pl-icon-camera"/>
            </slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pl-img",
        props: {
            width: {type: String, default: '80px'},                                                         //图片宽度
            height: {type: String, default: '80px'},                                                        //图片高度
            alt: {type: String},                                                                            //图片文本
            src: {type: String,},                                                                           //图片路径
            accept: {type: String, default: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'},          //选择图片的类型
            ObjectFit: {type: String, default: 'cover'},                                                    //图片object-fit样式值
            ObjectPosition: {type: String, default: 'center'},                                              //图片object-position样式值
        },
        data() {
            return {
                p_src: this.src,
            }
        },
        computed: {
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
            async pl_click() {
                const file = await this.$file.getFile({
                    accept: this.accept,
                })
                const dataURL = await this.$file.readAsDataURL(file)
                this.p_src = dataURL
            },
            pl_imgLoad() {
                console.log('image fetch success')
            },
            pl_imgError() {
                console.log('image fetch error')
            },
        }
    }
</script>

<style lang="scss">
    img[src=""], img:not([src]) {
        opacity: 0;
    }

    @include themeWrap {

        .pl-img {
            border: dashed #ddd 1px;
            display: inline-block;
            position: relative;
            box-sizing: border-box;
            padding: 1px;
            border-radius: plVar(borderFillet);

            .pl-img-el {
                object-fit: cover;
                object-position: center;
                border-radius: plVar(borderFillet);
            }

            .pl-img-empty {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                display: flex;
                align-items: center;
                justify-content: center;

                .pl-icon-camera {
                    font-size: 20px;
                    color: #ddd;
                }
            }

            &:hover {
                cursor: pointer;
                border-color: plVar(colorPrimary);

                .pl-icon-camera {
                    color: plVar(colorPrimary);
                    transition-property: transform;
                }
            }
        }
    }
</style>
