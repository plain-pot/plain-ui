import {designComponent} from "../../use/designComponent";
import {EditProps, useEdit} from '../../use/useEdit';
import {StyleProps, StyleStatus, useStyle} from '../../use/useStyle';
import {useSlots} from "../../use/useSlots";
import {useProps} from "../../use/useProps";
import {useModel} from "../../use/useModel";
import {useCollect} from "../../use/useCollect";
import Checkbox from '../checkbox/checkbox'
import {CheckboxStatus} from "../checkbox-inner/checkbox-inner";
import {computed} from 'vue';

const CheckboxGroup = designComponent({
    name: 'pl-checkbox-group',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {type: Array as any as new() => (string | number)[]},

        min: {type: Number},                                        // 最大勾选个数
        max: {type: Number},                                        // 最小勾选个数
        itemWidth: {type: [String, Number]},                        // 文本宽度
    },
    emits: {
        updateModelValue: (val: (string | number)[] | undefined) => true,
    },
    setup({props, event: {emit}}) {

        /*插槽*/
        const {slots} = useSlots()
        /*可编辑控制*/
        const {editComputed} = useEdit()
        /*样式控制*/
        useStyle({status: StyleStatus.primary})
        /*格式化属性*/
        const {propsState} = useProps(props, {
            min: useProps.NUMBER,
            max: useProps.NUMBER,
            itemWidth: useProps.NUMBER,
        })
        /*绑定值*/
        const modelValue = useModel(() => props.modelValue, emit.updateModelValue)
        /*子组件Checkbox*/
        const children = CheckboxGroupCollector.parent()
        /*可用子组件*/
        const activeChildren = computed(() => children.filter(({innerState: {props: {checkboxForAll}}}) => !checkboxForAll))

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
            getCheckStatus: (checkbox: typeof Checkbox.use.class): CheckboxStatus => {
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
                    if (propsState.max == null) {
                        return false
                    }
                    return !!val && val.length > propsState.max
                },
                /**
                 * 是否已经超出了min
                 * @author  韦胜健
                 * @date    2020/11/4 11:26
                 */
                min: (val: (string | number)[] | undefined) => {
                    if (propsState.min == null) {
                        return false
                    }
                    return !val || val.length < propsState.min
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
                        alert(`最多可选 ${propsState.max} 个选项！`)
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
                        alert(`最少选择 ${propsState.min} 个选项！`)
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
            clickCheckbox: (checkbox: typeof Checkbox.use.class) => {
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
                if (!val) {
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
                propsState,
            },
            render: () => slots.default()
        }
    },
})

export const CheckboxGroupCollector = useCollect(() => ({
    parent: CheckboxGroup,
    child: Checkbox,
}))

export default CheckboxGroup