<template>
    <pl-dom class="pl-dialog"
            contentClass="pl-dialog-body"
            container=".pl-dialog-container"
            autoCreateContainer
            :value="true"
            :contentStyle="{zIndex}"
    >
        <div class="pl-dialog-content" :style="contentStyles" :class="contentClass">
            pl-dialog
        </div>
    </pl-dom>
</template>

<script>
    import {EmitMixin, PropsMixinFactory, StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-dialog",
        mixins: [
            EmitMixin,
            StyleMixin,
            PropsMixinFactory.create({
                height: PropsMixinFactory.Number,
                width: PropsMixinFactory.Number,
                minHeight: PropsMixinFactory.Number,
                minWidth: PropsMixinFactory.Number,
                maxHeight: PropsMixinFactory.Number,
                maxWidth: PropsMixinFactory.Number,
            })
        ],
        props: {
            height: {type: [String, Number]},                                       // 对话框高度
            width: {type: [String, Number]},                                        // 对话框宽度
            minHeight: {type: [String, Number], default: 80},                       // 最小高度
            minWidth: {type: [String, Number], default: 200},                       // 最小宽度
            maxHeight: {type: [String, Number]},                                    // 最大高度
            maxWidth: {type: [String, Number]},                                     // 最大宽度

            title: {type: String},                                                  // 对话框标题
            fullscreen: {type: Boolean},                                            // 是否全屏
            mask: {type: Boolean},                                                  // 是否需要遮罩
            bodyClass: {},                                                          // 对话框内容自定义类名
            closeOnClickMask: {type: Boolean},                                      // 是否在点击遮罩的时候关闭对话框
            closeOnPressEscape: {type: Boolean},                                    // 是否在摁下 ESC 键的时候关闭对话框
            showClose: {type: Boolean},                                             // 是否展示关闭按钮
            beforeClose: {type: Boolean},                                           // 关闭之前的回调
            center: {type: Boolean},                                                // 是否纵向居中对其
            destroyOnClose: {type: Boolean},                                        // 关闭的时候是否销毁内容

            confirmButton: {type: Boolean},                                         // 是否显示确认按钮
            cancelButton: {type: Boolean},                                          // 是否显示取消按钮
            closeOnConfirm: {type: Boolean},                                        // 是否点击确认按钮之后自动关闭
            closeOnCancel: {type: Boolean},                                         // 是否点击取消按钮之后自动关闭
            confirmButtonText: {type: [String, Object]},                            // 确认按钮文本
            cancelButtonText: {type: [String, Object]},                             // 取消按钮文本
            confirmOnEnter: {type: Boolean},                                        // 是否在点击 enter 按键的时候触发 confirm 事件
            cancelOnEsc: {type: Boolean},                                           // 是否在点击 esc 按键的时候出发 cancel事件
        },
        data() {
            return {
                zIndex: null,
            }
        },
        computed: {
            contentStyles() {
                return {
                    width: this.$plain.utils.suffixPx(this.p_width),
                    height: this.$plain.utils.suffixPx(this.p_height),
                    minHeight: this.$plain.utils.suffixPx(this.p_minHeight),
                    minWidth: this.$plain.utils.suffixPx(this.p_minWidth),
                    maxHeight: this.$plain.utils.suffixPx(this.p_maxHeight),
                    maxWidth: this.$plain.utils.suffixPx(this.p_maxWidth),
                }
            },
            contentClass() {
                return [
                    `pl-dialog-content-shape-${this.p_shape || 'fillet'}`
                ]
            },
        },
        methods: {},
        mounted() {
            this.zIndex = this.$plain.nextIndex()
        }
    }
</script>

<style lang="scss">
    .pl-dialog {
        position: fixed;
        top: -9999px;
        left: -9999px;
        pointer-events: none;
    }

    .pl-dialog-container {
        position: fixed;
        top: -9999px;
        left: -9999px;
        pointer-events: none;
        z-index: 1500;
    }

    @include themify {
        .pl-dialog-body {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: auto;

            &:before {
                content: '';
                background-color: rgba(0, 0, 0, 0.2);
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }

            .pl-dialog-content {
                background-color: white;
                position: relative;
                z-index: 1;

                @include shapeMixin(dialog-content) {
                    border-radius: $value;
                }
            }
        }
    }
</style>