import {designComponent} from "../../use/designComponent";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps, StyleStatus, useStyle} from "../../use/useStyle";
import {useSlots} from "../../use/useSlots";
import {useProps} from "../../use/useProps";
import {useModel} from "../../use/useModel";
import {computed, Transition} from 'vue';
import {CheckboxStatus, DEFAULT_STATUS} from "../../utils/constant";
import {useClass} from "../../use/useClasses";
import {getKey, KEY} from "../keyboard";
import {ClickWave} from "../click-wave/click-wave-directive";
import {useScopedSlots} from "../../use/useScopedSlots";
import './radio.scss'
import Group from '../radio-group'
import {unit} from "plain-utils/string/unit";
import {useStyles} from "../../use/useStyles";

export default designComponent({
    name: 'pl-radio',
    directives: {ClickWave},
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {},                                             // 双向绑定值
        val: {type: String},                                        // 在group中的唯一标识
        label: {type: String},                                      // 显示文本
        width: {type: [String, Number]},                            // 宽度
        trueValue: {default: true},                                 // 真值
        falseValue: {default: false},                               // 假值
        checkStatus: {type: String},                                // 自定义选中状态
    },
    emits: {
        updateModelValue: (val: any) => true,
        click: (e?: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {

        const group = Group.use.inject(null)
        const {scopedSlots} = useScopedSlots({
            default: {checked: Boolean, status: String, click: Function},
        })
        const {slots} = useSlots(['label'])
        const {editComputed} = useEdit()
        const {styleComputed} = useStyle({status: DEFAULT_STATUS})
        const {propsState} = useProps(props, {
            width: useProps.NUMBER,
        })
        const model = useModel(() => props.modelValue, emit.updateModelValue)
        const checkStatus = computed(() => {
            if (!!props.checkStatus) {
                return props.checkStatus as CheckboxStatus
            }
            if (!!group) {
                return group.utils.getCheckStatus(props.val)
            } else {
                return model.value === props.trueValue ? CheckboxStatus.check : CheckboxStatus.uncheck
            }
        })

        const classes = useClass(() => [
            'pl-radio',
            `pl-radio-status-${styleComputed.value.status}`,
            `pl-radio-size-${styleComputed.value.size}`,
            {
                'pl-radio-checked': checkStatus.value === CheckboxStatus.check,
                'pl-radio-disabled': editComputed.value.disabled,
            },
        ])

        const styles = useStyles(style => {
            let width: number | null = null;
            if (!!propsState.width) {
                width = propsState.width as number
            }
            if (!!group && !!group.propsState.itemWidth) {
                width = group.propsState.itemWidth as number
            }
            if (width != null) {
                style.width = unit(width)
            }
        })

        const handler = {
            click: (e?: MouseEvent) => {
                emit.click(e)
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

        return {
            render: () => {
                return scopedSlots.default({
                    checked: checkStatus.value === CheckboxStatus.check,
                    status: checkStatus.value,
                    click: handler.click,
                }, (
                    <div
                        class={classes.value}
                        style={styles.value}
                        tabindex={0}
                        v-click-wave={{disabled: !editComputed.value.editable}}
                        onClick={handler.click}
                        onKeydown={handler.keydown}
                    >
                        <span class="plain-click-node">
                            <Transition name="pl-transition-fade" mode="out-in">
                                <pl-radio-inner checkStatus={checkStatus.value}
                                                key={checkStatus.value}
                                                disabled={editComputed.value.disabled}/>
                            </Transition>
                        </span>
                        {slots.label(<span class="pl-radio-label">{props.label}</span>)}
                    </div>
                ))
            }
        }
    },
})