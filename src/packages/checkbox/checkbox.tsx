import {designComponent} from "../../use/designComponent";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps, StyleStatus, useStyle} from "../../use/useStyle";
import {useModel} from "../../use/useModel";
import {useProps} from "../../use/useProps";
import {useScopedSlots} from "../../use/useScopedSlots";
import {useClass} from "../../use/useClasses";
import {computed, Transition} from 'vue';
import {CheckboxStatus} from "./checkbox-inner";
import {ClickWave} from "../click-wave/click-wave-directive";

export default designComponent({
    name: 'pl-checkbox',
    directives: {ClickWave},
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {},
        val: {},                                                    // 多选时选中值
        label: {type: String},                                      // 显示文本
        width: {type: [String, Number]},                            // 宽度
        trueValue: {default: true},                                 // 选中实际值
        falseValue: {default: false},                               // 非选中值

        checkboxForAll: {type: Boolean},                            // 是否为 checkbox 全选按钮
    },
    emits: {
        updateModelValue: (val: any) => true,
    },
    setup({props, event: {emit}}) {

        const modelValue = useModel(() => props.modelValue, emit.updateModelValue)
        const {propsState} = useProps(props, {
            label: useProps.PROMISE,
            width: useProps.NUMBER,
        })
        const {scopedSlots} = useScopedSlots({
            default: {checked: Boolean, status: String},
        })
        const {editComputed} = useEdit()
        const {styleComputed} = useStyle({status: StyleStatus.primary})

        const checkStatus = computed(() => {
            return modelValue.value === props.trueValue ? CheckboxStatus.check : CheckboxStatus.uncheck
        })

        const classes = useClass(() => [
            'pl-checkbox',
            `pl-checkbox-status-${styleComputed.value.status}`,
            `pl-checkbox-size-${styleComputed.value.size}`,
            `pl-checkbox-check-status-${checkStatus.value}`,
            {'pl-checkbox-disabled': editComputed.value.disabled},
        ])

        const handler = {
            clickEl: (e: MouseEvent) => {
                modelValue.value = checkStatus.value === CheckboxStatus.check ? props.falseValue : props.trueValue
            }
        }

        return {
            render: () => scopedSlots.default({checked: false, status: ''}, (
                <div class={classes.value}
                     onClick={handler.clickEl}
                     v-click-wave
                >
                    <span class="plain-click-node">
                        <Transition name="pl-transition-scale" mode="out-in">
                            <pl-checkbox-inner
                                checkStatus={checkStatus.value}
                                key={checkStatus.value}
                                disabled={editComputed.value.disabled}/>
                        </Transition>
                    </span>
                    {!!propsState.label && <span>{propsState.label}</span>}
                </div>
            ))
        }
    },
})