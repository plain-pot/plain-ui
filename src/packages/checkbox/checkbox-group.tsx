import {designComponent} from "../../use/designComponent";
import {EditProps, useEdit} from 'src/use/useEdit';
import {StyleProps, StyleStatus, useStyle} from 'src/use/useStyle';
import {useSlots} from "../../use/useSlots";
import {useProps} from "../../use/useProps";
import {useModel} from "../../use/useModel";
import {useCollect} from "../../use/useCollect";
import Checkbox from './checkbox'
import {CheckboxStatus} from "./checkbox-inner";
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

        const {slots} = useSlots()
        const {editComputed} = useEdit()
        useStyle({status: StyleStatus.primary})

        const propsState = useProps(props, {
            min: useProps.NUMBER,
            max: useProps.NUMBER,
            itemWidth: useProps.NUMBER,
        })

        const modelValue = useModel(() => props.modelValue, emit.updateModelValue)

        const children = CheckboxGroupCollector.parent()

        const activeChildren = computed(() => children.filter(child => child.innerState.editComputed.value.editable))

        const checkStatus = computed(() => {
            let hasCheck = false
            let hasUncheck = false
            activeChildren.value.forEach(child => {
                (child.innerState.checkStatus.value === CheckboxStatus.check) ? hasCheck = true : hasUncheck = true
            })
            if (hasCheck && !hasUncheck) {
                return CheckboxStatus.check
            }
            if (!hasCheck && hasUncheck) {
                return CheckboxStatus.uncheck
            }
            return CheckboxStatus.minus
        })

        const utils = {
            getCheckStatus: (checkbox: typeof Checkbox.use.class) => {
                if (checkbox.innerState.props.checkboxForAll) {
                    return checkStatus.value
                } else {
                    return (modelValue.value || []).indexOf(checkbox.innerState.props.val!) > -1 ? CheckboxStatus.check : CheckboxStatus.uncheck
                }
            }
        }

        const handler = {
            clickCheckbox: (checkbox: typeof Checkbox.use.class) => {

            }
        }


        return {
            refer: {
                utils,
            },
            render: () => {

            }
        }
    },
})

const CheckboxGroupCollector = useCollect(() => ({
    parent: CheckboxGroup,
    child: Checkbox,
}))

export default CheckboxGroup