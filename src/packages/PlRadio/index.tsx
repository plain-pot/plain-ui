import {computed, designComponent, PropType, SimpleFunction, useClasses, useModel, useRefs, useStyles} from 'plain-ui-composition'
import './radio.scss'
import {EditProps, useEdit} from "../../use/useEdit";
import {DEFAULT_STATUS, StyleProps, useStyle} from "../../use/useStyle";
import {CheckboxStatus} from "../../utils/constant";
import {unit} from "plain-utils/string/unit";
import {getKey, KEY} from "../keyboard";
import PlRadioInner from "../PlRadioInner";
import {useClickWave} from "../../directives/ClickWave";
import {PlRadioGroup} from "../PlRadioGroup";
import {Transition} from "vue";

export const PlRadio = designComponent({
    name: 'pl-radio',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {},                                             // 双向绑定值
        val: {type: [String, Number]},                              // 在group中的唯一标识
        width: {type: [String, Number]},                            // 宽度
        trueValue: {default: true as any},                          // 真值
        falseValue: {default: false as any},                        // 假值
        checkStatus: {type: String as PropType<'check' | 'uncheck'>}, // 自定义选中状态
        label: {type: String},                                      // 单选框文本
    },
    slots: ['labelContent'],
    scopeSlots: {
        default: (scope: { checked: boolean, status: 'check' | 'uncheck', click: SimpleFunction }) => {},
    },
    inheritPropsType: HTMLDivElement,
    emits: {
        onUpdateModelValue: (val: any) => true,
        onClick: (e?: MouseEvent) => true,
    },
    setup({props, slots, scopeSlots, event: {emit}}) {

        const group = PlRadioGroup.use.inject(null)
        const {refs, onRef} = useRefs({el: HTMLDivElement})
        const {editComputed} = useEdit()
        const {styleComputed} = useStyle({status: DEFAULT_STATUS})
        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
        const checkStatus = computed(() => {
            if (!!props.checkStatus) {
                return props.checkStatus
            }
            if (!!group) {
                return group.utils.getCheckStatus(props.val)
            } else {
                return model.value === props.trueValue ? CheckboxStatus.check : CheckboxStatus.uncheck
            }
        })

        const classes = useClasses(() => [
            'pl-radio',
            `pl-radio-status-${styleComputed.value.status}`,
            `pl-radio-size-${styleComputed.value.size}`,
            {
                'pl-radio-checked': checkStatus.value === CheckboxStatus.check,
                'pl-radio-disabled': editComputed.value.disabled,
            },
        ])

        const styles = useStyles(style => {
            let width: number | null | string = null;
            if (!!props.width) {
                width = props.width as number
            }
            if (!!group && !!group.props.itemWidth) {
                width = group.props.itemWidth
            }
            if (width != null) {
                style.width = unit(width)
            }
        })

        const handler = {
            click: (e?: MouseEvent) => {
                if (!!e) {
                    e.stopPropagation()
                }
                emit.onClick(e)
                if (!editComputed.value.editable || props.customReadonly) {
                    return
                }
                if (!!group) {
                    group.handler.onClickRadio(props.val)
                } else {
                    model.value = checkStatus.value === CheckboxStatus.check ? props.falseValue : props.trueValue
                }

                if (!!e) {
                    e.stopPropagation()
                    e.preventDefault()
                }
            },
            keydown: (e: KeyboardEvent) => {
                if (getKey(e) === KEY.space) {
                    e.preventDefault()
                    e.stopPropagation()
                    handler.click(e as any)
                }
            },
        }

        useClickWave({elGetter: () => refs.el, optionsGetter: () => ({size: 'normal', disabled: !editComputed.value.editable})})

        return {
            refer: {refs},
            render: () => {
                return scopeSlots.default({
                    checked: checkStatus.value === CheckboxStatus.check,
                    status: checkStatus.value,
                    click: handler.click,
                }, (
                    <div
                        ref={onRef.el}
                        class={classes.value}
                        style={styles.value}
                        tabindex={0}
                        onClick={handler.click}
                        onKeydown={handler.keydown}
                    >
                        <span class="plain-click-node">
                            <Transition name="pl-transition-fade" mode="out-in">
                                <PlRadioInner checkStatus={checkStatus.value} key={checkStatus.value}/>
                            </Transition>
                        </span>
                        {slots.labelContent(<span class="pl-radio-label">{props.label}</span>)}
                    </div>
                ))
            }
        }
    },
})

export default PlRadio
