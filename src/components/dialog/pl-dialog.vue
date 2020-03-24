<template>
    <pl-dom class="pl-dialog"
            container=".pl-dialog-container"
            autoCreateContainer
            :value="true">
        <transition name="pl-transition-dialog">
            <div class="pl-dialog-wrapper" @click="onClickWrapper" :style="wrapperStyle" :class="dialogClass" v-show="p_value">
                <div class="pl-dialog-body" :style="bodyStyle" :class="bodyClass" ref="body">
                    pl-dialog
                </div>
            </div>
        </transition>
    </pl-dom>
</template>

<script>
    import {EmitMixin, PropsMixinFactory, RefsMixinFactory, StyleMixin} from "../../utils/mixins";

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
            }),
            RefsMixinFactory({
                body: Object,
            }),
        ],
        emitters: {
            emitInput: Function,

        },
        props: {
            value: {type: Boolean},                                                 // model绑定是否打开对话框

            height: {type: [String, Number]},                                       // 对话框高度
            width: {type: [String, Number]},                                        // 对话框宽度
            minHeight: {type: [String, Number], default: '25vh'},                   // 最小高度
            minWidth: {type: [String, Number], default: '30vw'},                    // 最小宽度
            maxHeight: {type: [String, Number]},                                    // 最大高度
            maxWidth: {type: [String, Number]},                                     // 最大宽度
            bodyPadding: {type: String, default: '15vh 5vw'},                       // body的内边距

            title: {type: String},                                                  // 对话框标题
            fullscreen: {type: Boolean},                                            // 是否全屏
            mask: {type: Boolean},                                                  // 是否需要遮罩
            dialogClass: {},                                                          // 对话框内容自定义类名
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

            vertical: {type: String, default: 'start'},                             // 纵向对其方式：start,center,end
            horizontal: {type: String, default: 'center'},                          // 横向对其方式：start,center,end

        },
        data() {
            return {
                zIndex: null,
                p_value: this.value,
            }
        },
        watch: {
            value(val) {
                if (val) {
                    this.show()
                } else {
                    this.hide()
                }
            },
        },
        computed: {
            wrapperStyle() {
                return {
                    alignItems: `flex-${this.vertical}`.replace('flex-center', 'center'),
                    justifyContent: `flex-${this.horizontal}`.replace('flex-center', 'center'),
                    zIndex: this.zIndex,
                    padding: this.bodyPadding,
                }
            },
            bodyStyle() {
                return {
                    width: this.$plain.utils.suffixPx(this.p_width),
                    height: this.$plain.utils.suffixPx(this.p_height),
                    minHeight: this.$plain.utils.suffixPx(this.p_minHeight),
                    minWidth: this.$plain.utils.suffixPx(this.p_minWidth),
                    maxHeight: this.$plain.utils.suffixPx(this.p_maxHeight),
                    maxWidth: this.$plain.utils.suffixPx(this.p_maxWidth),
                }
            },
            bodyClass() {
                return [
                    `pl-dialog-body-shape-${this.p_shape || 'fillet'}`
                ]
            },
        },
        mounted() {
            this.zIndex = this.$plain.nextIndex()
        },
        methods: {
            show() {
                if (!!this.p_value) return
                this.p_value = true
                this.emitInput(this.p_value)
            },
            hide() {
                if (!this.p_value) return
                this.p_value = false
                this.emitInput(this.p_value)
            },
            confrim() {

            },
            cancel() {
                this.hide()
            },
            /*---------------------------------------handler-------------------------------------------*/
            onClickWrapper(e) {
                if (!this.body.contains(e.target)) {
                    this.cancel()
                }
            },
        },
    }
</script>

<style lang="scss">
    .pl-dialog {
        position: fixed;
        top: -9999px;
        left: -9999px;
        pointer-events: none;
    }

    .pl-dialog-wrapper {
        position: fixed;
        top: -9999px;
        left: -9999px;
        pointer-events: none;
        z-index: 1500;
    }

    @include themify {
        .pl-dialog-wrapper {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: auto;
            transition: all linear 300ms;

            &:before {
                content: '';
                background-color: rgba(0, 0, 0, 0.2);
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                user-select: none;
                transition: all linear 300ms;
            }

            .pl-dialog-body {
                background-color: white;
                position: relative;
                z-index: 1;
                transition: all cubic-bezier(0.410, 1.110, 0.615, 0.995) 300ms;
                box-shadow: 0 0 20px 8px rgba(0, 0, 0, 0.1);

                @include shapeMixin(dialog-body) {
                    border-radius: $value;
                }
            }

            &.pl-transition-dialog-enter-active, &.pl-transition-dialog-leave-active {
                &:before {
                    opacity: 1;
                }

                .pl-dialog-body {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            &.pl-transition-dialog-enter, &.pl-transition-dialog-leave-to {
                &:before {
                    opacity: 0;
                }

                .pl-dialog-body {
                    transform: translateY(-5vh);
                    opacity: 0;
                }
            }
        }
    }
</style>