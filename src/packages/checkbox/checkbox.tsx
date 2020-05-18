import {computed, defineComponent, inject, onBeforeUnmount} from "@vue/composition-api";

import {PLAIN_CHECKBOX_PROVIDER} from "@/packages/checkbox/checkbox-group";
import {$plain} from "@/packages/base";
import ClickWave from "@/directives/click-wave";
import {getKey, KEY} from "@/packages/keyboard";
import {EditProps, useEdit} from "@/use/useEdit";
import {StyleProps, useStyle} from "@/use/useStyle";
import {EmitFunc, useListener} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {FormatPropsType, useProps} from "@/use/useProps";

export default defineComponent({
    name: 'pl-checkbox',
    directives: {ClickWave},
    props: {
        ...EditProps,
        ...StyleProps,

        value: {},
        val: {},                                                    // 多选时选中值
        label: {type: String},                                      // 显示文本
        width: {type: [String, Number]},                            // 宽度
        trueValue: {default: true},                                 // 选中实际值
        falseValue: {default: false},                               // 非选中值

        ignore: {type: Boolean},                                    // 忽略 plCheckboxGroup
    },
    setup(props, context) {

        const {emit} = useListener(context, {input: EmitFunc,})
        const model = useModel(() => props.value, emit.input)
        const propsState = useProps(props, {
            label: FormatPropsType.promise,
            width: FormatPropsType.number,
        })
        const {editComputed} = useEdit()
        const styleState = useStyle(props)

        const checkboxGroupProvider = inject(PLAIN_CHECKBOX_PROVIDER, null) as ({ propsState, utils, handler } | null)

        /*---------------------------------------computer-------------------------------------------*/

        const isChecked = computed(() => {
            if (!!checkboxGroupProvider && !props.ignore) {
                return checkboxGroupProvider.utils.isChecked(props.val)
            } else {
                return model.value === props.trueValue
            }
        })
        const targetWidth = computed(() => {
            if (!!propsState.width) return propsState.width
            if (!!checkboxGroupProvider && !!checkboxGroupProvider.propsState.itemWidth) return checkboxGroupProvider.propsState.itemWidth
            return null
        })

        const classes = computed(() => ([
            'pl-checkbox',
            `pl-checkbox-status-${styleState.value.status}`,
            `pl-checkbox-size-${styleState.value.size}`,
            {
                'pl-checkbox-checked': isChecked.value,
                'pl-checkbox-disabled': editComputed.value.disabled,
            },
        ]))

        const styles = computed(() => {
            return !!targetWidth.value ? {width: $plain.utils.suffixPx(targetWidth.value)} : null
        })

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            click: () => {
                if (!editComputed.value.editable) return
                if (!!checkboxGroupProvider && !props.ignore) {
                    checkboxGroupProvider.handler.onClickCheckbox(props.val)
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

        /*---------------------------------------lifecycle-------------------------------------------*/
        if (!!checkboxGroupProvider && !props.ignore) {
            checkboxGroupProvider.handler.addItem(props.val)
            onBeforeUnmount(() => {
                checkboxGroupProvider.handler.removeItem(props.val)
            })
        }

        return () => (
            <div class={classes.value}
                 style={styles.value}
                 {...{directives: [{name: 'click-wave', value: {disabled: !editComputed.value.editable}}]}}
                 tabindex={0}
                 onClick={handler.click}
                 onKeydown={handler.keydown}
            >
                {
                    !!context.slots.default ? context.slots.default() : [
                        <span class="plain-click-node">
                            <transition name="pl-transition-fade" mode="out-in">
                                {!!context.slots['checkbox-inner'] ? context.slots['checkbox-inner']() : (
                                    isChecked.value ?
                                        <pl-checkbox-inner status="check" key="check" disabled={editComputed.value.disabled}/> :
                                        <pl-checkbox-inner status="uncheck" key="uncheck" disabled={editComputed.value.disabled}/>
                                )}
                            </transition>
                        </span>,
                        !propsState.label ? null : (
                            <div class="pl-checkbox-label">
                                {propsState.label}
                            </div>
                        )
                    ].filter(Boolean)
                }
            </div>
        )
    },
})