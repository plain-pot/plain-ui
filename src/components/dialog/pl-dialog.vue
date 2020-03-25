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
            emitConfirm: Function,
            emitCancel: Function,
        },
        props: {
            value: {type: Boolean},                                                 // model绑定是否打开对话框

            height: {type: [String, Number]},                                       // 对话框高度
            width: {type: [String, Number]},                                        // 对话框宽度
            minHeight: {type: [String, Number]},                                    // 最小高度
            minWidth: {type: [String, Number]},                                     // 最小宽度
            maxHeight: {type: [String, Number]},                                    // 最大高度
            maxWidth: {type: [String, Number]},                                     // 最大宽度
            fullHeight: {type: Boolean},                                            // 撑满高度
            fullWidth: {type: Boolean},                                             // 撑满宽度

            wrapperPadding: {type: String, default: '15vh 5vw'},                    // body的内边距
            contentPadding: {type: Boolean, default: true},                         // 内容内边距
            showHead: {type: Boolean, default: true},                               // 是否展示对话框标题栏
            transition: {type: String, default: 'pl-transition-dialog'},            // 弹框动画, pl-transition-dialog，pl-transition-dialog-top,pl-transition-dialog-left,pl-transition-dialog-right,pl-transition-dialog-bottom

            title: {type: String, default: '提示'},                                 // 对话框标题
            fullscreen: {type: Boolean},                                            // 是否全屏
            mask: {type: Boolean, default: true},                                   // 是否需要遮罩
            dialogClass: {type: String},                                            // 对话框内容自定义类名
            serviceClass: {type: String},                                           // 对话框服务内容自定义类名
            cancelOnClickMask: {type: Boolean, default: true},                       // 是否在点击遮罩的时候关闭对话框
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
            disabledCancel: {type: Boolean},                                        // 禁用cancel，当任何动作触发cancel时，不做任何处理，适用于开发者完全控制对话框的情况，对话框内置的按钮以及键盘事件不做任何处理
            disabledConfirm: {type: Boolean},                                       // 禁用confirm，当任何动作触发confirm时，不做任何处理,适用于开发者完全控制对话框的情况,对话框内置的按钮以及键盘事件不做任何处理

            vertical: {type: String, default: 'start'},                             // 纵向对其方式：start,center,end
            horizontal: {type: String, default: 'center'},                          // 横向对其方式：start,center,end
            loading: {type: Boolean},                                               // 弹出框添加 加载中的遮罩

        },
        data() {
            return {
                zIndex: null,
                p_value: false,
                p_loading: null,
                isMoved: false,

                keyboardEventOption: {
                    enter: () => {
                        if (this.isLoading) return
                        if (!!this.confirmOnEnter) {
                            this.confirm()
                        }
                    },
                    esc: () => {
                        if (this.isLoading) return
                        if (!!this.cancelOnEsc) {
                            this.cancel()
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
        render() {

            const directives = this.destroyOnClose ? [] : [{name: 'show', value: this.p_value,}]

            return (
                <pl-dom class="pl-dialog"
                        container=".pl-dialog-container"
                        autoCreateContainer
                        value={this.isMoved}>
                    <transition name={this.transition}>
                        {(!this.destroyOnClose ? true : this.p_value) && <div onClick={this.onClickWrapper} style={this.wrapperStyle} class={this.wrapperClass} {...{directives}}>
                            <div class={this.bodyClass} ref="body">
                                {this.hasHead && <div class="pl-dialog-head">
                                    {this.$slots.head || <span>{this.p_title}</span>}
                                    {!!this.showClose && <pl-button icon="el-icon-close" class="pl-dialog-head-close" shape="round" mode="text" onClick={this.onClickClose}/>}
                                </div>}

                                <div class="pl-dialog-content" style={this.contentStyle}>
                                    {this.$slots.default}
                                </div>
                                {this.hasFoot && <div class="pl-dialog-foot">
                                    {this.$slots.foot}
                                    {!!this.cancelButton && <pl-button label={this.cancelButtonText} mode="stroke" onClick={this.cancel}/>}
                                    {!!this.confirmButton && <pl-button label={this.confirmButtonText} onClick={this.confirm}/>}
                                </div>}
                                <pl-loading-mask value={this.loading || this.p_loading}/>
                            </div>
                        </div>}
                    </transition>
                </pl-dom>
            )
        },
        computed: {
            wrapperStyle() {
                return {
                    alignItems: this.center ? null : `flex-${this.vertical}`.replace('flex-center', 'center'),
                    justifyContent: `flex-${this.horizontal}`.replace('flex-center', 'center'),
                    zIndex: this.zIndex,
                    padding: !!this.center ? null : this.wrapperPadding,
                }
            },
            wrapperClass() {
                return {
                    [this.transition]: true,
                    ['pl-dialog-wrapper']: true,
                    [this.dialogClass]: !!this.dialogClass,
                    [this.serviceClass]: !!this.serviceClass,
                    'pl-dialog-fullscreen': this.fullscreen,
                    'pl-dialog-no-mask': !this.mask,
                    'pl-dialog-vertical-center': this.center,
                    'pl-dialog-no-content-padding': !this.contentPadding,
                }
            },
            bodyClass() {
                return [
                    'pl-dialog-body',
                    `pl-dialog-body-shape-${this.p_shape || 'fillet'}`,
                ]
            },
            contentStyle() {

                let height = this.fullHeight ? `calc(100vh - ${(!!this.hasHead ? 40 : 0) + (!!this.hasFoot ? 60 : 0)}px)` : this.p_height
                let width = this.fullWidth ? '100vw' : this.p_width

                let minHeight = this.p_minHeight != null ? this.p_minHeight : height != null ? null : '15vh'
                let minWidth = this.p_minWidth != null ? this.p_minWidth : width != null ? null : '25vw'
                let maxHeight = this.p_maxHeight != null ? this.p_maxHeight : height != null ? null : '80vh'
                let maxWidth = this.p_maxWidth != null ? this.p_maxWidth : width != null ? null : '60vw'

                return {
                    height: this.$plain.utils.suffixPx(height),
                    width: this.$plain.utils.suffixPx(width),
                    minHeight: this.$plain.utils.suffixPx(minHeight),
                    minWidth: this.$plain.utils.suffixPx(minWidth),
                    maxHeight: this.$plain.utils.suffixPx(maxHeight),
                    maxWidth: this.$plain.utils.suffixPx(maxWidth),
                }
            },
            hasHead() {
                return this.showHead
            },
            hasFoot() {
                return this.$slots.foot || this.confirmButton || this.cancelButton
            },
            isLoading() {
                return this.loading || this.p_loading
            },
        },
        mounted() {
            if (!!this.value) {
                this.show()
            }
        },
        beforeDestroy() {
            this.$plain.$keyboard.unbindListener(this.keyboardEventOption)
        },
        methods: {
            async show() {
                if (!!this.p_value) return
                if (!this.isMoved) {
                    this.isMoved = true
                    await this.$plain.nextTick()
                }
                this.$plain.$keyboard.listen(this.keyboardEventOption)
                this.$plain.$keyboard.cancelActiveElement()

                this.zIndex = this.$plain.nextIndex()
                await this.open()
            },
            async hide() {
                if (!this.p_value) return
                this.$plain.$keyboard.unbindListener(this.keyboardEventOption)

                await this.close()
            },
            confirm() {
                if (this.disabledConfirm) {
                    return
                }
                if (this.closeOnConfirm) {
                    this.hide()
                }
                this.emitConfirm()
            },
            cancel() {
                if (this.disabledCancel) {
                    return
                }
                if (this.closeOnCancel) {
                    this.hide()
                }
                this.emitCancel()
            },
            open() {
                this.p_value = true
                this.emitInput(this.p_value)
            },
            async close() {
                try {
                    if (!!this.beforeClose) {
                        this.p_loading = true
                        let flag = await this.beforeClose()
                        if (flag === false) return
                    }
                    this.p_value = false
                    this.emitInput(this.p_value)
                } catch (e) {
                    console.error(e)
                } finally {
                    this.p_loading = false
                }
            },
            /*---------------------------------------handler-------------------------------------------*/
            /**
             * 点击容器wrapper处理动作
             * @author  韦胜健
             * @date    2020/3/24 15:47
             */
            onClickWrapper(e) {
                if (this.isLoading) return
                if (!!this.cancelOnClickMask) {
                    if (!!this.body && !this.body.contains(e.target)) {
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
                if (this.isLoading) return
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
            box-sizing: border-box;

            .pl-dialog-head {
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
                overflow: auto;
                padding: 16px;
                font-size: 14px;
            }

            .pl-dialog-foot {
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

        &.pl-dialog-vertical-center {
            padding: 0;
            align-items: center;
        }

        &.pl-dialog-no-content-padding {
            .pl-dialog-content {
                padding: 0;
            }
        }
    }

    .pl-transition-dialog {
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
    }

    @include themify {
        .pl-dialog-wrapper {
            .pl-dialog-body {
                color: $itc;

                .pl-dialog-head {
                    color: $ihc;
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

        $dialogTransition: (
                left:translate3d(-100%, 0, 0),
                right:translate3d(100%, 0, 0),
                top:translate3d(0, -100%, 0),
                bottom:translate3d(0, 100%, 0),
        );

        @each $key, $value in $dialogTransition {
            .pl-transition-dialog-#{$key} {
                .pl-dialog-body {
                    transition: all $transition2 300ms;
                }

                &.pl-transition-dialog-#{$key}-enter-active, &.pl-transition-dialog-#{$key}-leave-active {
                    &:before {
                        opacity: 1;
                    }

                    .pl-dialog-body {
                        transform: translate3d(0, 0, 0);
                    }
                }

                &.pl-transition-dialog-#{$key}-enter, &.pl-transition-dialog-#{$key}-leave-to {
                    &:before {
                        opacity: 0;
                    }

                    .pl-dialog-body {
                        transform: $value;
                    }
                }
            }
        }
    }

    /*---------------------------------------dialog service-------------------------------------------*/

    .pl-dialog-service-edit {
        .pl-dialog-body {
            .pl-dialog-content {
                padding-bottom: 0;
            }
        }

        .pl-textarea, .pl-textarea-inner {
            height: 100%;
        }
    }

    @include themify {
        .pl-dialog-service {
            @include statusMixin(dialog-service) {
                .pl-dialog-service-item-message {
                    white-space: pre-wrap;

                    .pl-icon {
                        color: $value;
                        font-size: 24px;
                        vertical-align: middle;
                        margin-right: 14px;
                    }
                }
            }
        }
    }
</style>