import {defineComponent, reactive} from "@vue/composition-api";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {FormatPropsType, useProps} from "@/use/useProps";
import {useModel} from "@/use/useModel";
import PlainPopper from "../../../submodules/plain-popper";
import {$plain} from "@/packages/base";

export const PLAIN_POPPER_PROVIDER = '@@PLAIN_POPPER_PROVIDER'

export default defineComponent({
    name: 'pl-popper',
    props: {
        value: {type: Boolean},                                     // 双向绑定是否显示
        open: {type: Boolean},                                      // 当前是否显示，与value不同的是，value为false，动画可能才开始关闭，而 open 则是动画结束之后才会派发false出去

        trigger: {type: String, default: 'hover'},                  // hover,click,focus,manual
        title: {type: String},                                      // 标题
        content: {type: String},                                    // 内容
        disabled: {type: Boolean},                                  // 是否可以弹出
        transition: {type: String, default: 'pl-transition-fade'},  // 动画名称：pl-transition-fade, pl-transition-scale, pl-transition-scale-y, pl-transition-popper-drop
        popperClass: {type: String},                                // popper容器节点样式
        offset: {type: [Number, String]},                           // 偏移量
        width: {type: [Number, String]},                            // 宽度
        height: {type: [Number, String]},                           // 高度
        hoverOpenDelay: {type: [Number, String], default: 0},       // hover触发条件下，打开延迟时间
        hoverCloseDelay: {type: [Number, String], default: 200},    // hover触发条件下，关闭延迟时间
        noContentPadding: {type: Boolean},                          // 去掉默认内容内边距

        reference: {},                                              // 目标dom元素
        placement: {type: String, default: 'top-start'},            // 位置
        arrow: {type: Boolean, default: true},                      // 是否需要箭头
        boundary: {default: 'window'},                              // 边界元素

        sizeEqual: {type: Boolean},                                 // 与reference在方向上大小相等
        rootProps: {type: Object},                                  // 根节点dom元素的属性
    },
    setup(props) {

        const {emit} = useEvent({
            input: EmitFunc,                                        // v-model绑定
            updateOpen: EmitFunc,                                   // open属性更新
            open: EmitFunc,                                         // 派发打开事件，打开完毕，打开动画执行完毕
            close: EmitFunc,                                        // 派发关闭事件，关闭完毕，关闭动画执行完毕
            init: EmitFunc,                                         // 初始化事件，reference el以及popper el已经确认，popper实例已经创建，完成popper el的定位工作
            dstry: EmitFunc,                                        // 销毁事件，popper已经销毁
            show: EmitFunc,                                         // 打开事件，刚刚打开，动画未结束
            hide: EmitFunc,                                         // 关闭事件，刚刚关闭，动画未结束

            clickReference: EmitFunc,                               // 点击reference事件
            clickPopper: EmitFunc,                                  // 点击popper的事件
            clickPopperContent: EmitFunc,                           // 点击popper的内容的事件
            body: EmitFunc,                                         // 点击除了reference 以及popper派发的事件
            mousedownPopper: EmitFunc,                              // 鼠标摁住popperEl派发的事件

            enterReference: EmitFunc,                               // trigger为hover下，进入 reference 事件
            leaveReference: EmitFunc,                               // trigger为hover下，离开 reference 事件
            enterPopper: EmitFunc,                                  // trigger为hover下，进入popper事件
            leavePopper: EmitFunc,                                  // trigger为hover下，离开popper事件
            referenceFocus: EmitFunc,                               // trigger为focus下，reference 获取焦点事件
            referenceBlur: EmitFunc,                                // trigger为focus下，reference失去焦点事件

            beforeEnter: EmitFunc,                                  // 展开动画开始之前事件
            afterEnter: EmitFunc,                                   // 展开动画结束之后事件
            afterLeave: EmitFunc,                                   // 收起动画结束之后事件
        })

        /*---------------------------------------state-------------------------------------------*/

        const propsState = useProps(props, {
            hoverOpenDelay: FormatPropsType.number,
            hoverCloseDelay: FormatPropsType.number,
            offset: FormatPropsType.number,
            width: FormatPropsType.number,
            height: FormatPropsType.number,
        })

        const model = useModel(() => props.value, emit.input, false)
        const open = useModel(() => props.open, emit.updateOpen, false)

        const state = reactive({
            popper: null as PlainPopper | null,
            referenceEl: null as HTMLElement | null,
            popperEl: null as HTMLElement | null,
            contentEl: null as HTMLElement | null,
            onTransitionend: null as Function | null,

            zIndex: 0,
        })

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            show: (emitInput: boolean = true) => {
                if (model.value) return
                state.zIndex = $plain.nextIndex()
                model.value = true
                emit.show()
                if (emitInput) {
                    emit.input(model.value)
                }
                state.onTransitionend = () => {
                    open.value = true
                    state.onTransitionend = null
                }
            },
            hide: (emitInput: boolean = true) => {
                if (!model.value) return
                model.value = false
                emit.hide()
                if (emitInput) {
                    emit.input(model.value)
                }
                state.onTransitionend = () => {
                    open.value = false
                    state.onTransitionend = null
                }
            },
            refersh: () => {
                if (!state.referenceEl) return
                state.popper!.refresh()
            },
        }

        /*---------------------------------------handler-------------------------------------------*/


        return () => (
            <div>

            </div>
        )
    },
})