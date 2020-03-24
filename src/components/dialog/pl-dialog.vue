<template>
    <pl-dom class="pl-dialog"
            container=".pl-dialog-container"
            autoCreateContainer
            :value="true">
        <transition name="pl-transition-dialog">
            <div class="pl-dialog-wrapper" @click="onClickWrapper" :style="wrapperStyle" :class="wrapperClass" v-show="p_value">
                <div class="pl-dialog-body" :style="bodyStyle" :class="bodyClass" ref="body">
                    <div class="pl-dialog-head">
                        <slot name="head"><span>{{p_title}}</span></slot>
                        <pl-button icon="el-icon-close" class="pl-dialog-head-close" shape="round" mode="text" @click="onClickClose" v-if="showClose"/>
                    </div>
                    <div class="pl-dialog-content">
                        <slot></slot>
                    </div>
                    <div class="pl-dialog-foot">
                        <slot name="foot"/>
                        <pl-button label="取消" mode="stroke" @click="cancel"/>
                        <pl-button label="确认" @click="confirm"/>
                    </div>
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

                title: PropsMixinFactory.Promise,
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
            wrapperPadding: {type: String, default: '15vh 5vw'},                    // body的内边距

            title: {type: String, default: '提示'},                                 // 对话框标题
            fullscreen: {type: Boolean},                                            // 是否全屏
            mask: {type: Boolean, default: true},                                   // 是否需要遮罩
            dialogClass: {},                                                        // 对话框内容自定义类名
            closeOnClickMask: {type: Boolean, default: true},                       // 是否在点击遮罩的时候关闭对话框
            closeOnPressEscape: {type: Boolean, default: true},                     // 是否在摁下 ESC 键的时候关闭对话框
            showClose: {type: Boolean, default: true},                              // 是否展示关闭按钮
            beforeClose: {type: Boolean},                                           // 关闭之前的回调
            center: {type: Boolean},                                                // 是否纵向居中对其
            destroyOnClose: {type: Boolean, default: true},                         // 关闭的时候是否销毁内容

            confirmButton: {type: Boolean},                                         // 是否显示确认按钮
            cancelButton: {type: Boolean},                                          // 是否显示取消按钮
            closeOnConfirm: {type: Boolean, default: true},                         // 是否点击确认按钮之后自动关闭
            closeOnCancel: {type: Boolean, default: true},                          // 是否点击取消按钮之后自动关闭
            confirmButtonText: {type: [String, Object], default: '确认'},           // 确认按钮文本
            cancelButtonText: {type: [String, Object], default: '取消'},            // 取消按钮文本
            confirmOnEnter: {type: Boolean, default: true},                         // 是否在点击 enter 按键的时候触发 confirm 事件
            cancelOnEsc: {type: Boolean, default: true},                            // 是否在点击 esc 按键的时候出发 cancel事件

            vertical: {type: String, default: 'start'},                             // 纵向对其方式：start,center,end
            horizontal: {type: String, default: 'center'},                          // 横向对其方式：start,center,end

        },
        data() {
            return {
                zIndex: null,
                p_value: false,
                activeElement: null,

                keyboardEventOption: {
                    enter: () => {
                        console.log('enter')
                    },
                    esc: () => {
                        if (this.closeOnPressEscape) {
                            this.hide()
                        }
                    },
                }
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
                    padding: this.wrapperPadding,
                }
            },
            wrapperClass() {
                return {
                    [this.dialogClass]: !!this.dialogClass,
                    'pl-dialog-fullscreen': this.fullscreen,
                    'pl-dialog-no-mask': !this.mask,
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
                    `pl-dialog-body-shape-${this.p_shape || 'fillet'}`,

                ]
            },
        },
        mounted() {
            this.zIndex = this.$plain.nextIndex()

            if (!!this.value) {
                this.show()
            }
        },
        beforeDestroy() {
            this.$plain.$keyboard.unbindListener(this.keyboardEventOption)
            if (!!this.activeElement && !!this.activeElement.focus) {
                this.activeElement.focus()
            }
        },
        methods: {
            show() {
                if (!!this.p_value) return
                this.p_value = true
                this.emitInput(this.p_value)
                this.$plain.$keyboard.listen(this.keyboardEventOption)
                this.activeElement = this.$plain.$keyboard.cancelActiveElement()
            },
            hide() {
                if (!this.p_value) return
                this.p_value = false
                this.emitInput(this.p_value)
                this.$plain.$keyboard.unbindListener(this.keyboardEventOption)
                if (!!this.activeElement && !!this.activeElement.focus) {
                    this.activeElement.focus()
                }
            },
            confirm() {

            },
            cancel() {
                this.hide()
            },
            /*---------------------------------------handler-------------------------------------------*/
            /**
             * 点击容器wrapper处理动作
             * @author  韦胜健
             * @date    2020/3/24 15:47
             */
            onClickWrapper(e) {
                if (!!this.closeOnClickMask) {
                    if (!this.body.contains(e.target)) {
                        this.cancel()
                    }
                }
            },
            /**
             * 点击关闭按钮动作
             * @author  韦胜健
             * @date    2020/3/24 15:47
             */
            onClickClose() {
                this.cancel()
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
        z-index: 1500;

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
            box-shadow: 0 0 20px 8px rgba(100, 100, 100, 0.1);
            overflow: hidden;
            pointer-events: auto;

            .pl-dialog-head {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 40px;
                line-height: 40px;
                padding: 0 16px;
                font-size: 16px;
                letter-spacing: 2px;
                background-color: white;

                .pl-dialog-head-close {
                    position: absolute;
                    top: 5px;
                    bottom: 0;
                    right: 5px;
                    cursor: pointer;
                    height: 30px;
                    width: 30px;
                }
            }

            .pl-dialog-content {
                padding: 40px 16px;
                overflow: auto;

                height: inherit;
                width: inherit;
                max-width: inherit;
                max-height: inherit;
                min-width: inherit;
                min-height: inherit;
            }

            .pl-dialog-foot {
                background-color: white;
                position: absolute;
                bottom: 0;
                right: 0;
                left: 0;
                height: 60px;
                padding: 0 16px;
                display: flex;
                justify-content: flex-end;
                align-items: center;

                & > * + * {
                    margin-left: 16px;
                }
            }
        }

        &.pl-transition-dialog-enter-active, &.pl-transition-dialog-leave-active {
            &:before {
                opacity: 1;
            }

            .pl-dialog-body {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
        }

        &.pl-transition-dialog-enter, &.pl-transition-dialog-leave-to {
            &:before {
                opacity: 0;
            }

            .pl-dialog-body {
                transform: translateY(-5vh) scale(0.85);
                opacity: 0;
            }
        }

        &.pl-dialog-fullscreen {
            padding: 0 !important;

            .pl-dialog-body {
                position: fixed;
                height: 100% !important;
                width: 100% !important;
            }
        }

        &.pl-dialog-no-mask {
            pointer-events: none;

            &:before {
                display: none;
            }
        }
    }

    @include themify {
        .pl-dialog-wrapper {
            .pl-dialog-body {
                .pl-dialog-head {
                    color: $itc;
                    border-bottom: solid 1px $ibc;

                    .pl-dialog-head-close {
                        color: $icc;

                        &:hover {
                            color: $colorPrimary;
                        }
                    }
                }

                @include shapeMixin(dialog-body) {
                    border-radius: $value;
                }
            }
        }
    }
</style>