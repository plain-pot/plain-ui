import {designComponent} from "../../use/designComponent";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps, useStyle} from "../../use/useStyle";
import {useModel} from "../../use/useModel";
import {useProps} from "../../use/useProps";
import {useScopedSlots} from "../../use/useScopedSlots";
import {useClass} from "../../use/useClasses";
import {computed, Transition} from 'vue';
import {CheckboxStatus, DEFAULT_STATUS} from "../../utils/constant";
import {ClickWave} from "../click-wave/click-wave-directive";
import {CheckboxGroupCollector} from "../checkbox-group/checkbox-group";
import {useSlots} from "../../use/useSlots";
import {unit} from 'plain-utils/string/unit';
import {useStyles} from "../../use/useStyles";
import {PlCheckboxInner} from "../checkbox-inner/checkbox-inner";

export const PlCheckbox = designComponent({
    name: 'pl-checkbox',
    directives: {ClickWave},
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {},
        val: {type: [String, Number]},                              // 多选时选中值
        label: {type: String},                                      // 显示文本
        width: {type: [String, Number]},                            // 宽度
        trueValue: {default: true},                                 // 选中实际值
        falseValue: {default: false},                               // 非选中值

        checkboxForAll: {type: Boolean},                            // 是否为 checkbox 全选按钮
        checkStatus: {type: String},                                // checkbox 自定义状态
    },
    emits: {
        onUpdateModelValue: (val: any) => true,
        onClick: (e?: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {

        /*group父组件*/
        const checkboxGroup = CheckboxGroupCollector.child({injectDefaultValue: null})
        /*绑定值*/
        const modelValue = useModel(() => props.modelValue, emit.onUpdateModelValue)
        /*格式化属性值*/
        const {propsState} = useProps(props, {
            label: useProps.PROMISE,
            width: useProps.NUMBER,
        })
        /*插槽*/
        const {slots} = useSlots(['label'])
        /*作用域插槽*/
        const {scopedSlots} = useScopedSlots({
            default: {checked: Boolean, status: String, click: Function},
        })
        /*可编辑控制*/
        const {editComputed} = useEdit()
        /*样式控制*/
        const {styleComputed} = useStyle({status: DEFAULT_STATUS})
        /*当前组件内部变量引用*/
        const refer = {innerState: {props, editComputed}}
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

        const classes = useClass(() => [
            'pl-checkbox',
            `pl-checkbox-status-${styleComputed.value.status}`,
            `pl-checkbox-size-${styleComputed.value.size}`,
            `pl-checkbox-check-status-${checkStatus.value}`,
            {'pl-checkbox-disabled': editComputed.value.disabled},
        ])

        /*当前选项宽度*/
        const targetWidth = computed(() => {
            if (!!propsState.width) return propsState.width
            if (!!checkboxGroup && !!checkboxGroup.propsState.itemWidth) return checkboxGroup.propsState.itemWidth
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

        return {
            refer,
            render: () => scopedSlots.default(
                {
                    checked: checkStatus.value === CheckboxStatus.check,
                    status: checkStatus.value,
                    click: handler.clickEl,
                },
                (
                    <div class={classes.value}
                         style={styles.value}
                         onClick={handler.clickEl}
                         v-click-wave={{disabled: !editComputed.value.editable}}>
                        <span class="plain-click-node">
                            <Transition name="pl-transition-scale" mode="out-in">
                                <PlCheckboxInner
                                    checkStatus={checkStatus.value}
                                    key={checkStatus.value}
                                    disabled={editComputed.value.disabled!}/>
                            </Transition>
                        </span>
                        {slots.label(!!propsState.label ? <span class="pl-checkbox-label">{propsState.label}</span> : null)}
                    </div>
                ))
        }
    },
})