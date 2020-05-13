import {defineComponent, reactive} from '@vue/composition-api'
import {EditProps, StyleProps, useEdit, useEmit, useModel} from "@/util/use";

export default defineComponent({
    name: 'pl-input',
    props: {
        ...EditProps,
        ...StyleProps,

        value: {type: String},
        placeValue: {type: String},

        width: {type: [Number, String], default: null,},    // 输入框默认宽度
        minHeight: {type: [Number, String], default: 100},   // 文本域最小高度
        maxHeight: {type: [Number, String], default: 156},  // 文本域最大高度
        block: {type: Boolean},                             // 块级元素
        textarea: {type: Boolean},                          // 当前是否为文本域输入框
        suffixIcon: {type: [String, Function]},             // 右侧图标
        prefixIcon: {type: String},                         // 左侧图标
        clearIcon: {type: Boolean},                         // 清除图标
        clearHandler: {type: Function},                     // 点击清除图标处理逻辑

        autoHeight: {type: Boolean},                        // 自适应高度
        isFocus: {type: Boolean},                           // 当前是否处于激活状态
        inputReadonly: {type: Boolean},                     // 输入框只读
        throttleEnter: {type: [Boolean, Number]},           // enter按键事件节流
        autoLoading: {type: Boolean},                       // enter自动处理异步任务，开启/关闭loading状态

        /*---------------------------------------原生属性-------------------------------------------*/
        inputInnerTabindex: {type: Number, default: 0},
        type: {type: String, default: 'text'},
        placeholder: {type: String},
        nativeProps: {type: Object, default: () => ({})},
    },
    setup(props, context) {

        /*---------------------------------------emitter-------------------------------------------*/

        const emit = useEmit(context, {
            input: '值绑定事件',
            focus: '获取焦点事件',
            blur: '失去焦点事件',
            keydown: '按键事件',
            enter: '回车事件',

            clickInput: '点击输入框事件',
            clickPrefixIcon: '点击前置图标事件',
            clickSuffixIcon: '点击后置图标事件',
            clickClearIcon: '点击清空图标事件',
        })

        /*---------------------------------------state-------------------------------------------*/

        const {editState, editComputed} = useEdit(props)
        const value = useModel(() => props.value, emit.input)

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            input: (e: any) => {
                value.value = e.target.value
            },

        }

        return () => (
            <div>
                <input type="text" class={'pl-input'} value={value.value} oninput={handler.input}/>
            </div>
        )
    },
})