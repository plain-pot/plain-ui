import {computed, defineComponent, onBeforeUnmount, onMounted, reactive, watch} from "@vue/composition-api";
import {SlotFunc, useSlots} from "@/use/useSlots";
import {useScopedSlots} from "@/use/useScopedSlots";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {$plain} from "@/packages/base";
import {useRefs} from "@/use/useRefs";
import {getDropdownTrigger} from "@/packages/dropdown/DropdownTrigger";
import {PopperTrigger, PopperTriggerType} from "@/packages/popper/PopperTrigger";
import {useEditPopperAgent} from "@/packages/popper/agent/useEditPopperAgent";
import {$dropdown} from "@/packages/dropdown/$dropdown";

export default defineComponent({
    name: 'pl-dropdown',
    props: {
        value: {type: Boolean},                                         // model绑定是否打开下拉列表
        open: {type: Boolean},                                          // open绑定是否已经打开下拉列表
        trigger: {type: String, default: 'click'},                      // click, focus, hover, manual
        width: {type: [String, Number]},                                // popper 宽度
        height: {type: [String, Number]},                               // popper高度

        hoverOpenDelay: {type: [Number, String], default: 0},           // hover触发条件下，打开延迟时间
        hoverCloseDelay: {type: [Number, String], default: 200},        // hover触发条件下，关闭延迟时间

        closeOnClickItem: {type: Boolean, default: true},               // 点击选项的时候是否自动关闭
        popperProps: {type: Object},                                    // popper 属性参数
    },
    setup(props) {

        const refs = useRefs()

        const {$slots, slots} = useSlots({
            dropdown: SlotFunc,
        })
        const {$scopedSlots} = useScopedSlots()

        const {emit, on, off} = useEvent({
            input: EmitFunc,
            updateOpen: EmitFunc,

            enterReference: EmitFunc,
            leaveReference: EmitFunc,

            enterPopper: EmitFunc,
            leavePopper: EmitFunc,

            referenceFocus: EmitFunc,
            referenceBlur: EmitFunc,

            clickReference: EmitFunc,
            clickPopper: EmitFunc,
            clickBody: EmitFunc,

            clickWindow: EmitFunc,

            clickItem: EmitFunc,
        })

        /*---------------------------------------state-------------------------------------------*/

        const model = useModel(() => props.value, emit.input)
        const open = useModel(() => props.open, emit.updateOpen)

        const state = reactive({
            el: null as HTMLElement | null,
            val: props.value,
            trigger: null as PopperTrigger | null,
        })

        const popperProps = computed(() => {
            return Object.assign({
                width: props.width === undefined ? null : props.width,
                height: props.height,
                placement: 'bottom-start',
                sizeEqual: false,
            }, props.popperProps || {})
        })

        const agentState = useEditPopperAgent(() => $dropdown(() => {
            return ({
                reference: () => refs.$el,
                props: {
                    height: props.height,
                    closeOnClickItem: props.closeOnClickItem && props.trigger !== PopperTriggerType.manual,
                    content: (h) => {
                        return slots.dropdown()
                    },
                },
                popperProps: {
                    trigger: PopperTriggerType.manual,
                    ...(popperProps.value as any),
                },
                listener: {
                    'click-item': handler.clickItem,
                    'enter-popper': emit.enterPopper,
                    'leave-popper': emit.leavePopper,
                },
                popperListener: {
                    emit: emit.handleEmit,
                    'update:open': val => open.value = val,
                    'show': () => model.value = true,
                    'hide': () => model.value = false,
                }
            })
        }))

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            show: () => {
                agentState.methods.show()
            },
            hide: () => {
                agentState.methods.hide()
            },
            toggle: () => {
                agentState.methods.toggle()
            }
        }

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            clickReference: (e) => {
                emit.clickReference(e)
            },
            clickBody: (e: MouseEvent) => {
                emit.clickWindow(e)
                if (!agentState.isShow.value) {
                    return
                }

                if (state.el!.contains(e.target as Node)) {
                    /*点击了reference*/
                    return
                }
                if (agentState.state.agent!.freezeState.popperService.$el!.contains(e.target as Node)) {
                    /*点击了content*/
                    return
                }
                emit.clickBody(e)
            },
            clickItem: (e) => {
                emit.clickItem(e)
            },
        }

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            bindEvent: () => {
                state.el!.addEventListener('click', handler.clickReference)
                document.body.addEventListener('click', handler.clickBody)
            },
            unbindEvent: () => {
                state.el!.removeEventListener('click', handler.clickReference)
                document.body.removeEventListener('click', handler.clickBody)
            }
        }

        /*---------------------------------------watcher-------------------------------------------*/

        watch(() => props.value, (val) => {
            if (!!val) {
                $plain.nextTick(() => {
                    methods.show()
                })
            } else {
                methods.hide()
            }
        }, {immediate: true})

        watch(() => model.value, async (val) => {
            await $plain.nextTick()
            if (!!state.el) {
                state.el.setAttribute('pl-dropdown', val ? 'open' : 'close')
            }
        }, {immediate: true})

        /*---------------------------------------lifecycle-------------------------------------------*/


        onMounted(() => {
            state.el = refs.$el

            state.trigger = getDropdownTrigger(props.trigger as PopperTriggerType, {
                model,
                open,

                show: methods.show,
                hide: methods.hide,

                reference: refs.$el,

                hoverOpenDelay: props.hoverOpenDelay as number,
                hoverCloseDelay: props.hoverCloseDelay as number,

                on,
                off,
                emit,
            })

            if (!!state.trigger) {
                state.trigger.init()
            } else {
                throw new Error('initialize dropdown trigger filed! trigger:' + props.trigger)
            }

            utils.bindEvent()
        })

        onBeforeUnmount(() => {
            if (!!state.trigger) {
                state.trigger.destroy()
            }
            if (!!agentState.state.agent) {
                agentState.state.agent.destroy()
            }
            utils.unbindEvent()
        })


        return () => {
            if (!!$slots.default && !!$slots.default[0]) return $slots.default[0]
            else if (!!$scopedSlots.default) return $scopedSlots.default({show: model.value, open: open.value})
            return null
        }
    },
})