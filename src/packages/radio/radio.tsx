import {computed, defineComponent, inject} from "@vue/composition-api";
import ClickWave from "@/directives/click-wave";
import {StyleProps, useStyle} from "@/use/useStyle";
import {EditProps, useEdit} from "@/use/useEdit";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {FormatPropsType, useProps} from "@/use/useProps";
import {useModel} from "@/use/useModel";

import {PLAIN_RADIO_GROUP_PROVIDER} from "@/packages/radio/radio-group";
import {PlainUtils} from "@/util/util";
import {getKey, KEY} from "@/packages/keyboard";
import {useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-radio',
    directives: {ClickWave},
    props: {
        ...EditProps,
        ...StyleProps,

        value: {type: Boolean},                                     // 双向绑定值
        val: {type: String},                                        // 在group中的唯一标识
        label: {type: String},                                      // 显示文本
        width: {type: [String, Number]},                            // 宽度
        trueValue: {default: true},                                 // 真值
        falseValue: {default: false},                               // 假值
        ignore: {type: Boolean},                                    // 忽略 plCheckboxGroup
    },
    setup(props, context) {

        const {slots} = useSlots()

        /*---------------------------------------emitter-------------------------------------------*/
        const {emit} = useEvent({
            input: EmitFunc,
        })

        /*---------------------------------------state-------------------------------------------*/

        const {editComputed} = useEdit()
        const {styleComputed} = useStyle()

        const propsState = useProps(props, {
            width: FormatPropsType.number,
        })

        const model = useModel(() => props.value, emit.input)

        const radioGroupProvider: any = inject(PLAIN_RADIO_GROUP_PROVIDER, null)

        /*---------------------------------------computer-------------------------------------------*/

        const targetWidth = computed(() => {
            if (!!propsState.width) return propsState.width
            if (radioGroupProvider != null && !!radioGroupProvider.propsState.itemWidth) return radioGroupProvider.propsState.itemWidth
            return null
        })

        const isChecked = computed(() => {
            if (!!radioGroupProvider) {
                return radioGroupProvider.isChecked(props.val)
            } else {
                return model.value === props.trueValue
            }
        })

        const classes = computed(() => [
            'pl-radio',
            `pl-radio-status-${styleComputed.value.status}`,
            `pl-radio-size-${styleComputed.value.size}`,
            {
                'pl-radio-checked': isChecked.value,
                'pl-radio-disabled': editComputed.value.disabled,
            },
        ])

        const styles = computed(() => {
            return !!targetWidth.value ? {width: PlainUtils.suffixPx(targetWidth.value)} : null
        })

        const handler = {
            click: () => {
                if (!editComputed.value.editable) {
                    return
                }
                if (!!radioGroupProvider) {
                    if (isChecked.value) {
                        return;
                    }
                    radioGroupProvider.onClickRadio(props.val)
                } else {
                    model.value = isChecked.value ? props.falseValue : props.trueValue
                }
            },
            keydown: (e: KeyboardEvent) => {
                if (getKey(e) === KEY.space) {
                    e.preventDefault()
                    e.stopPropagation()
                    handler.click()
                }
            }
        }


        return () => (
            <div class={classes.value}
                 style={styles.value}
                 tabindex={0}
                 {...{directives: [{name: 'click-wave', value: {disabled: !editComputed.value.editable}}]}}

                 onClick={handler.click}
                 onKeydown={handler.keydown}
            >
                {
                    slots.default(
                        [
                            <span class="plain-click-node">
                                <transition name="pl-transition-fade" mode="out-in">
                                    {!!isChecked.value && <pl-radio-inner status="check" key="check" disabled={editComputed.value.disabled}/>}
                                    {!isChecked.value && <pl-radio-inner status="uncheck" key="uncheck" disabled={editComputed.value.disabled}/>}
                                </transition>
                            </span>,
                            !!props.label ? <div class="pl-radio-label">{props.label}</div> : null
                        ]
                    )
                }
            </div>
        )
    },
})