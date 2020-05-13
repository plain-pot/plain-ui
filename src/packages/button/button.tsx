import {defineComponent} from "@vue/composition-api";
import {FormatPropsType, useProps} from "@/util/use";

export default defineComponent({
    name: 'pl-button',
    props: {
        mode: {type: String, default: 'fill'},                  // fill,stroke,text
        label: {type: String},                                  // 按钮文本
        width: {type: [String, Number]},                        // 按钮宽度
        icon: {type: String},                                   // 按钮图标
        active: {type: Boolean},                                // 按钮是否高亮
        noPadding: {type: Boolean},                             // 按钮是否无边距
        block: {type: Boolean},                                 // 块级元素
        throttleClick: {type: [Boolean, Number]},                 // click节流
        autoLoading: {type: Boolean},                           // 在执行click处理函数时，是否自动变更为加载状态

        /*---------------------------------------native-------------------------------------------*/
        type: {type: String, default: 'button'},
        nativeProps: {},
    },
    setup(props, context) {

        const newProps = useProps(props, {
            width: FormatPropsType.number,
            label: FormatPropsType.promise,
        })


        return () => (
            <button class={'pl-button'}>
                111
            </button>
        )
    },
})