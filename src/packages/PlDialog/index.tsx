import './dialog.scss'
import {computed, designComponent, nextIndex, onBeforeUnmount, PropType, reactive, ref, useClasses, useRefs, watch} from "plain-ui-composition";
import {StyleProps, useStyle} from "../../use/useStyle";
import {EditProps} from "../../use/useEdit";
import {unit} from "plain-utils/string/unit";
import {KeyboardService, KeyboardServiceOption} from "../keyboard";
import {createPortal} from "react-dom";
import PlTransition from "../PlTransition";

import PlButton from "../PlButton";
import {PlLoadingMask} from "../PlLoadingMask";
import PlIcon from "../PlIcon";

export const PlDialog = designComponent({
    name: 'pl-dialog',
    provideRefer: true,
    props: {
        ...StyleProps,
        ...EditProps,

        modelValue: {type: Boolean},                                            // model绑定是否打开对话框

        height: {type: [String, Number]},                                       // 对话框高度
        width: {type: [String, Number]},                                        // 对话框宽度
        minHeight: {type: [String, Number]},                                    // 最小高度
        minWidth: {type: [String, Number]},                                     // 最小宽度
        maxHeight: {type: [String, Number]},                                    // 最大高度
        maxWidth: {type: [String, Number]},                                     // 最大宽度
        fullHeight: {type: Boolean},                                            // 撑满高度
        fullWidth: {type: Boolean},                                             // 撑满宽度

        wrapperPadding: {type: [String, Boolean], default: '15vh 5vw'},         // body的内边距
        contentPadding: {type: Boolean, default: true},                         // 内容内边距
        showHead: {type: Boolean, default: true},                               // 是否展示对话框标题栏
        transition: {type: String, default: 'pl-transition-dialog'},            // 弹框动画, pl-transition-dialog，pl-transition-dialog-top,pl-transition-dialog-left,pl-transition-dialog-right,pl-transition-dialog-bottom

        fullscreen: {type: Boolean},                                            // 是否全屏
        mask: {type: Boolean, default: true},                                   // 是否需要遮罩
        dialogClass: {type: String},                                            // 对话框内容自定义类名
        serviceClass: {type: String},                                           // 对话框服务内容自定义类名
        cancelOnClickMask: {type: Boolean, default: true},                      // 是否在点击遮罩的时候关闭对话框
        showClose: {type: Boolean, default: true},                              // 是否展示关闭按钮
        beforeClose: Function,                                                  // 关闭之前的回调
        center: {type: Boolean},                                                // 是否纵向居中对其
        destroyOnClose: {type: Boolean, default: true},                         // 关闭的时候是否销毁内容
        footAlign: {type: String as PropType<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'>},

        confirmButton: {type: Boolean},                                         // 是否显示确认按钮
        cancelButton: {type: Boolean},                                          // 是否显示取消按钮
        closeOnConfirm: {type: Boolean, default: true},                         // 是否点击确认按钮之后自动关闭
        closeOnCancel: {type: Boolean, default: true},                          // 是否点击取消按钮之后自动关闭
        confirmButtonText: {type: [String, Object], default: '确认'},            // 确认按钮文本
        cancelButtonText: {type: [String, Object], default: '取消'},             // 取消按钮文本
        confirmOnEnter: {type: Boolean, default: true},                         // 是否在点击 enter 按键的时候触发 confirm 事件
        cancelOnEsc: {type: Boolean, default: true},                            // 是否在点击 esc 按键的时候出发 cancel事件
        disabledCancel: {type: Boolean},                                        // 禁用cancel，当任何动作触发cancel时，不做任何处理，适用于开发者完全控制对话框的情况，对话框内置的按钮以及键盘事件不做任何处理
        disabledConfirm: {type: Boolean},                                       // 禁用confirm，当任何动作触发confirm时，不做任何处理,适用于开发者完全控制对话框的情况,对话框内置的按钮以及键盘事件不做任何处理

        vertical: {type: String, default: 'start'},                             // 纵向对其方式：start,center,end
        horizontal: {type: String, default: 'center'},                          // 横向对其方式：start,center,end
        loading: {type: Boolean},                                               // 弹出框添加 加载中的遮罩
    },
    emits: {
        onUpdateModelValue: (val: boolean) => true,
        onOpen: () => true,
        onClose: () => true,
        onConfirm: () => true,
        onCancel: () => true,
    },
    slots: ['default', 'head', 'foot', 'title'],
    setup({props, slots, event}) {

        const {emit} = event

        const {refs, onRef} = useRefs({
            body: HTMLDivElement,
            el: HTMLDivElement,
        })
        const state = reactive({
            zIndex: nextIndex(),
            loading: false,
        })
        const isLoading = computed(() => state.loading || props.loading)
        const {styleComputed} = useStyle({status: undefined})
        const model = ref(false)

        /*---------------------------------------computer-------------------------------------------*/
        const wrapperStyles = computed(() => ({
            alignItems: props.center ? null : `flex-${props.vertical}`.replace('flex-center', 'center'),
            justifyContent: `flex-${props.horizontal}`.replace('flex-center', 'center'),
            zIndex: state.zIndex,
            padding: !!props.center ? null : props.wrapperPadding,
        }))

        const wrapperClasses = useClasses(() => [
            'pl-dialog',
            props.transition,
            props.dialogClass,
            props.serviceClass,
            {
                'pl-dialog-fullscreen': props.fullscreen,
                'pl-dialog-no-mask': !props.mask,
                'pl-dialog-vertical-center': props.center,
                'pl-dialog-no-content-padding': !props.contentPadding,
            }
        ])

        const bodyClasses = useClasses(() => [
            'pl-dialog-body',
            `pl-dialog-body-shape-${styleComputed.value.shape}`,
        ])

        const hasHead = computed(() => {
            return props.showHead
        })
        const hasFoot = computed(() => {
            return slots.foot.isExist() || props.confirmButton || props.cancelButton
        })

        const contentStyle = computed(() => {
            let height = props.fullHeight ? `calc(100vh - ${(!!hasHead.value ? 45 : 0) + (hasFoot.value ? 50 : 0)}px)` : props.height
            let width = props.fullWidth ? '100vw' : props.width

            let minHeight = props.minHeight !== undefined ? props.minHeight : height !== undefined ? null : '120px'
            let minWidth = props.minWidth !== undefined ? props.minWidth : width !== undefined ? null : '500px'
            let maxHeight = props.maxHeight !== undefined ? props.maxHeight : height !== undefined ? null : '80vh'
            let maxWidth = props.maxWidth !== undefined ? props.maxWidth : width !== undefined ? null : '60vw'

            return {
                height: unit(height),
                width: unit(width),
                minHeight: unit(minHeight),
                minWidth: unit(minWidth),
                maxHeight: unit(maxHeight),
                maxWidth: unit(maxWidth),
            }
        })

        /*---------------------------------------handler-------------------------------------------*/
        const handler = {
            keyboardEventOption: {
                "enter": () => {
                    if (isLoading.value) return
                    if (!!props.confirmOnEnter) {
                        methods.confirm()
                    }
                },
                "esc": () => {
                    if (isLoading.value) return
                    if (!!props.cancelOnEsc) {
                        methods.cancel()
                    }
                }
            } as KeyboardServiceOption,
            clickWrapper: (e: MouseEvent) => {
                /*currentTarget 为节点 div.pl-dialog，因为react的事件代理机制，target可能不是currentTarget的子节点。*/
                /*比如这里target可能是 dropdown-item，实际上dialog和dropdown在dom结构中视兄弟节点*/
                const {target, currentTarget} = e as any as { target: HTMLElement, currentTarget: HTMLElement }
                if (!currentTarget.contains(target)) {
                    return;
                }
                if (isLoading.value) {
                    return
                }
                if (!!props.cancelOnClickMask) {
                    if (!!refs.body && !refs.body.contains(e.target as HTMLElement)) {
                        methods.cancel()
                    }
                }
            },
            clickClose: () => {
                if (isLoading.value) {
                    return
                }
                methods.cancel()
            },
        }
        /*---------------------------------------methods-------------------------------------------*/
        const methods = {
            show: async () => {
                if (model.value) return
                KeyboardService.listen(handler.keyboardEventOption)
                KeyboardService.cancelActiveElement()
                state.zIndex = nextIndex()
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
                emit.onConfirm()
            },
            cancel() {
                if (props.disabledCancel) {
                    return
                }
                if (props.closeOnCancel) {
                    methods.hide()
                }
                emit.onCancel()
            },
            open() {
                model.value = true
                emit.onUpdateModelValue(model.value)
            },
            async close() {
                try {
                    if (!!props.beforeClose) {
                        state.loading = true
                        let flag = await props.beforeClose!()
                        if (flag === false) return
                    }
                    model.value = false
                    emit.onUpdateModelValue(model.value)
                } catch (e) {
                    console.error(e)
                } finally {
                    state.loading = false
                }
            },
        }
        /*---------------------------------------watch-------------------------------------------*/

        watch(() => props.modelValue, (val) => {
            val ? setTimeout(methods.show, 100) : methods.hide()
        }, {immediate: true})

        onBeforeUnmount(() => {
            KeyboardService.unbindListener(handler.keyboardEventOption)
            if (model.value) {
                methods.hide()
            }
        })

        return {
            refer: {
                props, event, model: model as { value: boolean },
            },
            render: () => {
                return (
                    createPortal(
                        <PlTransition name={props.transition} show={model.value} unmount={props.destroyOnClose} onEntered={emit.onOpen} onExited={emit.onClose}>
                            {<div onClick={handler.clickWrapper} style={wrapperStyles.value as any} class={wrapperClasses.value} ref={onRef.el}>
                                <div class={bodyClasses.value} ref={onRef.body}>
                                    {hasHead.value && <div class="pl-dialog-head">
                                        {slots.head(<span class="pl-dialog-head-title">{slots.title() || '提示'}</span>)}
                                        {!!props.showClose && (
                                            <div class="pl-dialog-head-close" onClick={handler.clickClose}>
                                                <PlIcon icon="el-icon-close"/>
                                            </div>
                                        )}
                                    </div>}
                                    <div class="pl-dialog-content" style={contentStyle.value as any}>
                                        {slots.default()}
                                    </div>
                                    {hasFoot.value && <div class="pl-dialog-foot" style={{justifyContent: props.footAlign || 'flex-end'}}>
                                        {slots.foot()}

                                        {!!props.cancelButton && <PlButton label={props.cancelButtonText} mode="stroke" onClick={methods.cancel}/>}
                                        {!!props.confirmButton && <PlButton label={props.confirmButtonText} onClick={methods.confirm}/>}
                                    </div>}
                                    <PlLoadingMask v-model={isLoading.value}/>
                                </div>
                            </div>}
                        </PlTransition>,
                        document.querySelector('.pl-root-service-container')!)
                )
            }
        }
    }
})

export default PlDialog
