import './collapse.scss'
import {computed, designComponent, useClasses, useModel, useRefs} from "plain-ui-composition"
import PlCollapseGroup from "../PlCollapseGroup";
import PlIcon from "../PlIcon";
import {createCounter} from "plain-utils/utils/createCounter";

const valCounter = createCounter('collapse')

export const PlCollapse = designComponent({
    name: 'pl-collapse',
    props: {
        modelValue: {type: Boolean, default: true},             // 双向绑定，控制是否显示
        detail: {type: String},                                 // 详情内容，可以用默认插槽内容代替
        disabled: {type: Boolean, default: null},               // 禁用展开收起的功能
        val: {type: String},                                    // 唯一标识，结合 CollapseGroup的时候使用
        title: {type: String},                                  // 标题
    },
    emits: {
        onUpdateModelValue: (val: boolean) => true
    },
    inheritPropsType: HTMLDivElement,
    slots: [
        'default',
        'head',
    ],
    setup({props, event: {emit}, slots}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})
        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
        const group = PlCollapseGroup.use.inject(null)

        const selfVal = computed(() => props.val || valCounter())

        const isOpen = computed(() => {
            if (!!group) {
                return group.utils.isOpen(selfVal.value)
            } else {
                return model.value
            }
        })

        const classes = useClasses(() => [
            'pl-collapse',
            {
                'pl-collapse-is-open': isOpen.value,
            }
        ])

        const isDisabled = computed(() => {
            if (props.disabled != null) {
                return props.disabled
            }
            if (!!group) {
                return group.props.disabled
            }
            return false
        })

        const handler = {
            onClickTitle: () => {
                if (isDisabled.value) {
                    return
                }
                if (!!group) {
                    group.handler.clickCollapseTitle(selfVal.value)
                } else {
                    model.value = !model.value
                }
            }
        }

        return {
            refer: {refs},
            render: () => (
                <div class={classes.value} ref={onRef.el}>
                    {(slots.head.isExist() || props.title) && (
                        <div class="pl-collapse-title">
                            <PlIcon icon="el-icon-caret-right" onClick={handler.onClickTitle}/>
                            <div onClick={handler.onClickTitle}>{slots.head(props.title)}</div>
                        </div>
                    )}
                    <div class="pl-collapse-detail" style={{display: isOpen.value && (!!props.detail || slots.default.isExist()) ? '' : 'none'}}>
                        {slots.default(props.detail)}
                    </div>
                </div>
            )
        }
    },
})

export default PlCollapse
