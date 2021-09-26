import {computed, designComponent, inject, PropType, useModel, useNumber, useRefs} from "plain-ui-composition"
import {EditProps, useEdit} from "../../use/useEdit";
import {DEFAULT_STATUS, StyleProps, useStyle} from "../../use/useStyle";
import {CheckboxStatus} from "../../utils/constant";
import {PlCheckbox} from "../PlCheckbox";
import $$notice from "../$$notice";
import {useCollect} from "../../use/useCollect";

export const PlCheckboxGroup = designComponent({
    name: 'pl-checkbox-group',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {type: Array as PropType<(string | number)[]>},

        min: {type: Number},                                        // 最大勾选个数
        max: {type: Number},                                        // 最小勾选个数
        itemWidth: {type: [String, Number]},                        // 文本宽度
    },
    inheritPropsType: HTMLDivElement,
    slots: ['default'],
    emits: {
        onUpdateModelValue: (val: (string | number)[] | undefined) => true,
    },
    setup({props, slots, event: {emit}}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})
        const formItem = inject('@@pl-form-item', null)
        /*可编辑控制*/
        const {editComputed} = useEdit()
        /*样式控制*/
        useStyle({status: DEFAULT_STATUS})
        /*格式化属性*/
        const {numberState} = useNumber(props, ['max', 'min'])
        /*绑定值*/
        const modelValue = useModel(() => props.modelValue, emit.onUpdateModelValue)
        /*子组件Checkbox*/
        const children = CheckboxGroupCollector.parent()
        /*可用子组件*/
        const activeChildren = computed(() => children.filter(({innerState: {props: {checkboxForAll, customReadonly}}}) => !checkboxForAll && !customReadonly))

        /*可用子组件keys*/
        const allKeys = computed((() => activeChildren.value.map(({innerState: {props: {val}}}) => val)))

        /*当前选择状态*/
        const checkStatus = computed(() => {
            let hasCheck = false
            let hasUncheck = false
            if (!modelValue.value) {
                return CheckboxStatus.uncheck
            }
            activeChildren
                .value
                .forEach(child => modelValue.value!
                    .indexOf(child.innerState.props.val!) > -1 ? hasCheck = true : hasUncheck = true)

            if (hasCheck && !hasUncheck) {
                return CheckboxStatus.check
            }
            if (!hasCheck && hasUncheck) {
                return CheckboxStatus.uncheck
            }
            return CheckboxStatus.minus
        })

        const utils = {
            /**
             * 子组件用来获取状态工具函数
             * @author  韦胜健
             * @date    2020/11/4 11:26
             */
            getCheckStatus: (checkbox: typeof PlCheckbox.use.class): CheckboxStatus => {
                const {innerState: {props: {checkboxForAll, val}}} = checkbox
                if (checkboxForAll) {
                    return checkStatus.value
                } else {
                    return !!modelValue.value && modelValue.value.indexOf(val!) > -1 ? CheckboxStatus.check : CheckboxStatus.uncheck
                }
            },
            exceed: {
                /**
                 * 是否已经超出了max
                 * @author  韦胜健
                 * @date    2020/11/4 11:26
                 */
                max: (val: (string | number)[] | undefined) => {
                    if (numberState.max == null) {
                        return false
                    }
                    return !!val && val.length > numberState.max
                },
                /**
                 * 是否已经超出了min
                 * @author  韦胜健
                 * @date    2020/11/4 11:26
                 */
                min: (val: (string | number)[] | undefined) => {
                    if (numberState.min == null) {
                        return false
                    }
                    return !val || val.length < numberState.min
                }
            },
            changeValue: {
                /**
                 * 添加选项赋值
                 * @author  韦胜健
                 * @date    2020/11/4 11:26
                 */
                add: (val: (string | number)[]) => {
                    if (utils.exceed.max(val)) {
                        $$notice.warn(`最多可选 ${numberState.max} 个选项！`)
                    } else {
                        modelValue.value = val
                    }
                },
                /**
                 * 删除选项赋值
                 * @author  韦胜健
                 * @date    2020/11/4 11:26
                 */
                delete: (val: (string | number)[]) => {
                    if (utils.exceed.min(val)) {
                        $$notice.warn(`最少选择 ${numberState.min} 个选项！`)
                    } else {
                        modelValue.value = val
                    }
                }
            },
        }

        const handler = {
            /**
             * 处理点击按钮事件
             * @author  韦胜健
             * @date    2020/11/4 11:27
             */
            clickCheckbox: (checkbox: typeof PlCheckbox.use.class) => {
                if (!editComputed.value.editable) {
                    return
                }
                const {innerState: {props: {val, checkboxForAll}}} = checkbox

                /*全选按钮*/
                if (checkboxForAll) {
                    if (checkStatus.value !== CheckboxStatus.check) {
                        /*全选*/
                        utils.changeValue.add([...allKeys.value as string[]])
                    } else {
                        /*取消全选*/
                        utils.changeValue.delete([])
                    }
                    return
                }

                /*单个按钮*/
                if (val == null) {
                    throw new Error('Checkbox: val is necessary when Checkbox in CheckboxGroup')
                }
                if (!modelValue.value) {
                    return utils.changeValue.add([val])
                }
                const value = [...modelValue.value]
                const index = value.indexOf(val)
                if (index > -1) {
                    /*删除*/
                    value.splice(index, 1)
                    utils.changeValue.delete(value)
                } else {
                    /*添加*/
                    utils.changeValue.add([...value, val])
                }
            }
        }

        return {
            refer: {
                utils,
                handler,
                numberState,
                props,
                refs,
            },
            render: () => !formItem ? slots.default() : (
                <div class="pl-checkbox-group" ref={onRef.el}>
                    {slots.default()}
                </div>
            )
        }
    },
})

export const CheckboxGroupCollector = useCollect(() => ({
    parent: PlCheckboxGroup,
    child: PlCheckbox,
}))

export default PlCheckboxGroup
