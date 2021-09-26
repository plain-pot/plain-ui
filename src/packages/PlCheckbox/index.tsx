import {computed, designComponent, useModel, useNumber, useRefs, useStyles, SimpleFunction, useClasses} from "plain-ui-composition";
import {EditProps, useEdit} from "../../use/useEdit";
import {DEFAULT_STATUS, StyleProps, useStyle} from "../../use/useStyle";
import {CheckboxStatus} from "../../utils/constant";
import {unit} from "plain-utils/string/unit";
import PlCheckboxInner from "../PlCheckboxInner";
import {CheckboxGroupCollector} from "../PlCheckboxGroup";
import {useClickWave} from "../../directives/ClickWave";
import './checkbox.scss'
import {isis} from "../../utils/ifSlotIsString";
import {Transition} from "vue";

export const PlCheckbox = designComponent({
    name: 'pl-checkbox',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {},
        val: {type: [String, Number]},                              // 多选时选中值
        width: {type: [String, Number]},                            // 宽度
        trueValue: {default: true as any},                           // 选中实际值
        falseValue: {default: false as any},                         // 非选中值
        label: {type: String},                                       // 复选框文本

        checkboxForAll: {type: Boolean},                            // 是否为 checkbox 全选按钮
        checkStatus: {type: String},                                // checkbox 自定义状态
    },
    emits: {
        onUpdateModelValue: (val: any) => true,
        onClick: (e?: MouseEvent) => true,
    },
    slots: ['labelContent'],
    inheritPropsType: HTMLDivElement,
    scopeSlots: {
        default: (scope: { checked: boolean, status: keyof typeof CheckboxStatus, click: SimpleFunction }) => {},
    },
    setup({props, slots, scopeSlots, event: {emit}}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})
        /*group父组件*/
        const checkboxGroup = CheckboxGroupCollector.child({injectDefaultValue: null})
        /*绑定值*/
        const modelValue = useModel(() => props.modelValue, emit.onUpdateModelValue)

        /*可编辑控制*/
        const {editComputed} = useEdit()
        /*样式控制*/
        const {styleComputed} = useStyle({status: DEFAULT_STATUS})
        /*当前组件内部变量引用*/
        const refer = {refs, innerState: {props, editComputed}}
        /*当前选中状态*/
        const checkStatus = computed((): CheckboxStatus => {
            if (!!props.checkStatus) {
                return props.checkStatus as CheckboxStatus
            }
            if (!!checkboxGroup) {
                return checkboxGroup.utils.getCheckStatus(refer)
            } else {
                return modelValue.value === props.trueValue ? CheckboxStatus.check : CheckboxStatus.uncheck
            }
        })

        const classes = useClasses(() => [
            'pl-checkbox',
            `pl-checkbox-status-${styleComputed.value.status}`,
            `pl-checkbox-size-${styleComputed.value.size}`,
            `pl-checkbox-check-status-${checkStatus.value}`,
            {'pl-checkbox-disabled': editComputed.value.disabled},
        ])

        /*当前选项宽度*/
        const targetWidth = computed(() => {
            if (!!props.width) return props.width
            if (!!checkboxGroup && !!checkboxGroup.props.itemWidth) return checkboxGroup.props.itemWidth
            return null
        })

        const styles = useStyles(style => {
            style.width = unit(targetWidth.value)
        })

        const handler = {
            clickEl: (e?: MouseEvent) => {
                if (!!e) {
                    e.stopPropagation()
                }
                emit.onClick(e)
                if (!editComputed.value.editable || props.customReadonly) {
                    return
                }
                if (!!checkboxGroup) {
                    return checkboxGroup.handler.clickCheckbox(refer)
                }
                modelValue.value = checkStatus.value === CheckboxStatus.check ? props.falseValue : props.trueValue

                if (!!e) {
                    e.stopPropagation()
                    e.preventDefault()
                }
            }
        }

        useClickWave({elGetter: () => refs.el, optionsGetter: () => ({size: 'large', disabled: !editComputed.value.editable}),})

        return {
            refer,
            render: () => scopeSlots.default(
                {
                    checked: checkStatus.value === CheckboxStatus.check,
                    status: checkStatus.value,
                    click: handler.clickEl,
                },
                (
                    <div class={classes.value}
                         style={styles.value}
                         onClick={handler.clickEl}
                         ref={onRef.el}>
                        <span class="plain-click-node">
                            <Transition name="pl-transition-fade" mode="out-in">
                                <PlCheckboxInner
                                    checkStatus={checkStatus.value}
                                    key={checkStatus.value}
                                    disabled={editComputed.value.disabled!}/>
                            </Transition>
                        </span>
                        {slots.labelContent(<span class="pl-checkbox-label">{props.label}</span>)}
                    </div>
                ))
        }
    },
})

export default PlCheckbox
