import {computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, watch} from "@vue/composition-api";
import {StyleProps, useStyle} from "@/use/useStyle";
import {EditProps, useEdit, useEditOuterLoading} from "@/use/useEdit";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {FormatPropsType, useProps} from "@/use/useProps";
import {ElRef, useRefs} from "@/use/useRefs";

import {$plain} from "@/packages/base";
import {KeyboardService, KeyboardServiceOption} from "@/packages/keyboard";
import {SlotFunc, useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-dialog',
    props: {
        ...StyleProps,
        ...EditProps,

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
        beforeClose: {type: Function},                                           // 关闭之前的回调
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
    setup(props) {

        const {slots, $slots} = useSlots({
            head: SlotFunc,
            foot: SlotFunc,
        })

        const refs = useRefs({
            body: ElRef
        })

        const {emit} = useEvent({
            input: EmitFunc,
            confirm: EmitFunc,
            cancel: EmitFunc,
        })

        /*---------------------------------------state-------------------------------------------*/

        const {editComputed} = useEdit()
        const loading = useEditOuterLoading(editComputed)

        const {styleComputed} = useStyle()

        const propsState = useProps(props, {
            height: FormatPropsType.number,
            width: FormatPropsType.number,
            minHeight: FormatPropsType.number,
            minWidth: FormatPropsType.number,
            maxHeight: FormatPropsType.number,
            maxWidth: FormatPropsType.number,

            title: FormatPropsType.promise,
        })

        const state = reactive({
            zIndex: 0,
            isMoved: false,
        })

        const model = ref(false)

        /*---------------------------------------computer-------------------------------------------*/

        const wrapperStyles = computed(() => ({
            alignItems: props.center ? null : `flex-${props.vertical}`.replace('flex-center', 'center'),
            justifyContent: `flex-${props.horizontal}`.replace('flex-center', 'center'),
            zIndex: state.zIndex,
            padding: !!props.center ? null : props.wrapperPadding,
        }))

        const wrapperClasses = computed(() => ({
            [props.transition]: true,
            ['pl-dialog-wrapper']: true,
            [props.dialogClass!]: !!props.dialogClass,
            [props.serviceClass!]: !!props.serviceClass,
            'pl-dialog-fullscreen': props.fullscreen,
            'pl-dialog-no-mask': !props.mask,
            'pl-dialog-vertical-center': props.center,
            'pl-dialog-no-content-padding': !props.contentPadding,
        }))

        const bodyClasses = computed(() => [
            'pl-dialog-body',
            `pl-dialog-body-shape-${styleComputed.value.shape}`,
        ])

        const hasHead = computed(() => {
            return props.showHead
        })
        const hasFoot = computed(() => {
            return !!$slots.foot || props.confirmButton || props.cancelButton
        })

        const contentStyle = computed(() => {
            let height = props.fullHeight ? `calc(100vh - ${(!!hasHead.value ? 40 : 0) + (!!hasFoot.value ? 60 : 0)}px)` : propsState.height
            let width = props.fullWidth ? '100vw' : propsState.width

            let minHeight = propsState.minHeight != null ? propsState.minHeight : height != null ? null : '15vh'
            let minWidth = propsState.minWidth != null ? propsState.minWidth : width != null ? null : '25vw'
            let maxHeight = propsState.maxHeight != null ? propsState.maxHeight : height != null ? null : '80vh'
            let maxWidth = propsState.maxWidth != null ? propsState.maxWidth : width != null ? null : '60vw'

            return {
                height: $plain.utils.suffixPx(height),
                width: $plain.utils.suffixPx(width),
                minHeight: $plain.utils.suffixPx(minHeight),
                minWidth: $plain.utils.suffixPx(minWidth),
                maxHeight: $plain.utils.suffixPx(maxHeight),
                maxWidth: $plain.utils.suffixPx(maxWidth),
            }
        })

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            keyboardEventOption: {
                "enter": () => {
                    if (loading.value) return
                    if (!!props.confirmOnEnter) {
                        methods.confirm()
                    }
                },
                "esc": () => {
                    if (loading.value) return
                    if (!!props.cancelOnEsc) {
                        methods.cancel()
                    }
                }
            } as KeyboardServiceOption,
            clickWrapper: (e: MouseEvent) => {
                if (loading.value) {
                    return
                }
                if (!!props.cancelOnClickMask) {
                    if (!!refs.body && !refs.body.contains(e.target as HTMLElement)) {
                        methods.cancel()
                    }
                }
            },
            clickClose: () => {
                if (loading.value) {
                    return
                }
                methods.cancel()
            }
        }

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            show: async () => {
                if (!!model.value) return
                if (!state.isMoved) {
                    state.isMoved = true
                    await $plain.nextTick()
                }
                KeyboardService.listen(handler.keyboardEventOption)
                KeyboardService.cancelActiveElement()

                state.zIndex = $plain.nextIndex()
                await methods.open()
            },
            async hide() {
                if (!model.value) return
                KeyboardService.unbindListener(handler.keyboardEventOption)

                await this.close()
            },
            confirm() {
                if (props.disabledConfirm) {
                    return
                }
                if (props.closeOnConfirm) {
                    methods.hide()
                }
                emit.confirm()
            },
            cancel() {
                if (props.disabledCancel) {
                    return
                }
                if (props.closeOnCancel) {
                    methods.hide()
                }
                emit.cancel()
            },
            open() {
                model.value = true
                emit.input(model.value)
            },
            async close() {
                try {
                    if (!!props.beforeClose) {
                        loading.value = true
                        let flag = await props.beforeClose()
                        if (flag === false) return
                    }
                    model.value = false
                    emit.input(model.value)
                } catch (e) {
                    console.error(e)
                } finally {
                    loading.value = false
                }
            },
        }

        /*---------------------------------------watch-------------------------------------------*/

        watch(() => props.value, (val) => {
            if (val) {
                methods.show()
            } else {
                methods.hide()
            }
        }, {lazy: true})

        /*---------------------------------------lifecycle-------------------------------------------*/

        onMounted(() => {
            if (!!props.value) {
                methods.show()
            }
        })

        onBeforeUnmount(() => {
            KeyboardService.unbindListener(handler.keyboardEventOption)
        })

        return () => {
            const directives = props.destroyOnClose ? [] : [{name: 'show', value: model.value,}]

            return (
                <pl-portal class="pl-dialog"
                           container=".pl-dialog-container"
                           autoCreateContainer
                           value={state.isMoved}>
                    <transition name={props.transition}>
                        {(!props.destroyOnClose ? true : model.value) && <div onClick={handler.clickWrapper} style={wrapperStyles.value} class={wrapperClasses.value} {...{directives}}>
                            <div class={bodyClasses.value} ref="body">
                                {hasHead.value && <div class="pl-dialog-head">
                                    {slots.head(<span>{propsState.title}</span>)}
                                    {!!props.showClose && <pl-button icon="el-icon-close" class="pl-dialog-head-close" shape="round" mode="text" onClick={handler.clickClose}/>}
                                </div>}
                                <div class="pl-dialog-content" style={contentStyle.value}>
                                    {slots.default()}
                                </div>
                                {hasFoot.value && <div class="pl-dialog-foot">
                                    {slots.foot()}

                                    {!!props.cancelButton && <pl-button label={props.cancelButtonText} mode="stroke" onClick={methods.cancel}/>}
                                    {!!props.confirmButton && <pl-button label={props.confirmButtonText} onClick={methods.confirm}/>}
                                </div>}
                                <pl-loading-mask value={loading.value}/>
                            </div>
                        </div>}
                    </transition>
                </pl-portal>
            )
        }
    },
})