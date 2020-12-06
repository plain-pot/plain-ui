import {designComponent} from "../../../use/designComponent";
import {EditProps, useEdit} from "../../../use/useEdit";
import {useRefs} from "../../../use/useRefs";
import Scroll from '../../scroll'
import {useModel} from "../../../use/useModel";
import {computed, watch, nextTick} from 'vue';
import {zeroize} from "plain-utils/string/zeroize";
import {findOne} from "plain-utils/object/findOne";
import './time-column.scss'
import {useRefList} from "../../../use/useRefList";

export default designComponent({
    name: 'pl-time-base-column',
    props: {
        ...EditProps,

        layout: {type: String, default: 'h'},   // 模式，h：时，m：分，s：秒
        modelValue: {required: true},// 当前值
        max: {type: Number},                    // 最大值
        min: {type: Number},                    // 最小值
        custom: {type: Function as any as new() => ((layout: string) => number[])},// 自定义选项函数
        checkDisabled: Function,                // 用来判断选项是否禁用的函数
    },
    emits: {
        updateModelValue: (val: number) => true,
        clickItem: (i: number) => true,
    },
    setup({props, event}) {

        const {editComputed} = useEdit()

        const {refs} = useRefs({scroll: Scroll,})
        const liList = useRefList<HTMLLIElement>()

        const model = useModel(() => props.modelValue as any, event.emit.updateModelValue, {onChange: () => nextTick().then(methods.resetPosition)})

        const options = computed(() => {
            if (!!props.custom) {
                return props.custom(props.layout).map(item => zeroize(item, 2))
            }
            let count = props.layout === 'h' ? 24 : 60
            let options: string[] = []
            for (let i = 0; i < count; i++) {
                options.push(zeroize(i, 2))
            }
            return options
        })

        const methods = {
            resetPosition: () => {
                let value = model.value || 0
                let start = 0
                let find = findOne(options.value, item => Number(item) == value, true) as { item: string, index: number }
                if (!!find) {
                    start = find.index
                }
                let scrollTop = liList[start].offsetTop
                refs.scroll!.methods.scroll({y: scrollTop}, 150)
            },
        }

        const utils = {
            checkDisabled: (item: string | number) => {
                item = Number(item)
                if (editComputed.value.disabled) return true
                if (!!props.checkDisabled && props.checkDisabled(item, props.layout)) return true

                if (props.max != null && props.max < item) return true
                if (props.min != null && props.min > item) return true
                return false
            }
        }

        const handler = {
            clickItem: (item: string | number) => {
                item = Number(item)
                if (utils.checkDisabled(item)) {
                    return
                }
                model.value = item
                event.emit.clickItem(item)
            }
        }

        return {
            render: () => (
                <div class="pl-time-base-column">
                    <pl-scroll ref="scroll">
                        <ul class="pl-time-base-column-list">
                            {[1, 2, 3].map((item, index) => (
                                <li
                                    ref={val => liList[index] = val as any}
                                    class="pl-time-base-column-item"
                                    key={-item}/>)
                            )}

                            {options.value.map((item, index) => (
                                <li{...{
                                    class: [
                                        'pl-time-base-column-item',
                                        'pl-time-base-column-option-item',
                                        {
                                            'pl-time-base-column-item-current': model.value != null && model.value == Number(item),
                                            'pl-time-base-column-item-disabled': utils.checkDisabled(item),
                                        }
                                    ],
                                    key: item,
                                    onClick: () => handler.clickItem(item),
                                    ref: val => liList[index + 3] = val as any
                                }}>
                                    {item}
                                </li>
                            ))}

                            {[1, 2, 3].map(item => (<li class="pl-time-base-column-item" key={-item - 3}/>))}
                        </ul>
                    </pl-scroll>
                </div>
            )
        }
    },
})