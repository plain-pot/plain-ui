import {defineComponent} from "@vue/composition-api";
import ClickWave from "@/directives/click-wave";
import {useEmit, useModel} from "@/util/use";

export default defineComponent({
    name: 'pl-radio',
    directives: {ClickWave},
    props: {
        value: {type: Boolean},                                     // 双向绑定值
        val: {type: String},                                        // 在group中的唯一标识
        label: {type: String},                                      // 显示文本
        width: {type: [String, Number]},                            // 宽度
        trueValue: {default: true},                                 // 真值
        falseValue: {default: false},                               // 假值
        ignore: {type: Boolean},                                    // 忽略 plCheckboxGroup
    },
    setup(props, context) {

        /*---------------------------------------emitter-------------------------------------------*/
        const emit = useEmit({

        })

        const model = useModel(() => props.value, null)
    },
})