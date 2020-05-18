import {defineComponent, reactive} from "@vue/composition-api";
import {EmitFunc, FormatPropsType, StyleProps, useEmit, useProps, useRef} from "@/util/use";

export default defineComponent({
    name: 'pl-dialog',
    props: {
        ...StyleProps,

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
    setup(props, context) {

        const body = useRef('body', context)

        const emit = useEmit(context, {
            input: EmitFunc,
            confirm: EmitFunc,
            cancel: EmitFunc,
        })

        /*---------------------------------------state-------------------------------------------*/

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
            loading: false,
        })


        return () => (
            <div>

            </div>
        )
    },
})