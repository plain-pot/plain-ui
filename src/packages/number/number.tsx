import {defineComponent, reactive} from "@vue/composition-api";
import ClickWave from "@/directives/click-wave";
import {EditProps, EmitFunc, FormatPropsType, StyleProps, useEmit, useModel, useProps} from "@/util/use";

export default defineComponent({
    name: 'pl-number',
    directives: {ClickWave},
    props: {
        ...StyleProps,
        ...EditProps,

        value: {type: [String, Object]},                            // 双向绑定值
        min: {type: [String, Number]},                              // 最小值
        max: {type: [String, Number]},                              // 最大值
        step: {type: [String, Number], default: 1},                 // 计数器步长
        stepStrictly: {type: Boolean},                              // 是否只能输入 step 的倍数
        precision: {type: Number},                                  // 数值精度
        hideButton: {type: Boolean},                                // 隐藏操作按钮

        /*---------------------------------------input-------------------------------------------*/
        inputProps: {type: Object},                                 // pl-input属性配置对象
    },
    setup(props, context) {

        const emit = useEmit(context, {
            focus: EmitFunc,
            blur: EmitFunc,
            input: EmitFunc,
            enter: EmitFunc,
        })

        const model = useModel(() => props.value, emit.input)

        const state = reactive({
            isFocus: false,                     // 当前是否获取焦点
            interval: null,                     // 进步器长摁定时器
            clearInterval: () => {              // 清除定时器
                if (state.interval != null) {
                    clearInterval(state.interval)
                }
                window.removeEventListener('mouseup', state.clearInterval)
            }
        } as {
            isFocus: boolean,
            interval: null | number,
            clearInterval: () => void
        })

        const propsState = useProps(props, {
            min: FormatPropsType.number,
            max: FormatPropsType.number,
            step: FormatPropsType.number,
            precision: FormatPropsType.number,
        })

    },
})