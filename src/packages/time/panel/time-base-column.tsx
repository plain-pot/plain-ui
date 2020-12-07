import {designComponent} from "../../../use/designComponent";
import {EditProps, useEdit} from "../../../use/useEdit";
import {useRefs} from "../../../use/useRefs";
import Scroll from '../../scroll'
import {useModel} from "../../../use/useModel";
import {computed, nextTick, onMounted} from 'vue';
import {zeroize} from "plain-utils/string/zeroize";
import {findOne} from "plain-utils/object/findOne";
import './time-base-column.scss'
import {useRefList} from "../../../use/useRefList";

const size = 24;

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
        disableChangeOnScroll: {type: Boolean}, // 是否禁用在滚动的时候触发更新值动作
    },
    emits: {
        updateModelValue: (val: number) => true,
        clickItem: (i: number) => true,
    },
    setup({props, event}) {

        const {editComputed} = useEdit()

        /*
        *  临时变量，用来判断当前scrollTop是否已经滚动到指定位置，用来判别是鼠标触发的scroll还是resetPosition触发的scroll
        *  以解决点击item的时候，因为触发了scroll派发两次事件的问题
        */
        let currentScrollTop = 0;

        /*
        *  判断当前是否已经mounted，因为一开始mounted，resetPosition的时候，会导致触发onScroll，这里做延迟标记，使得mounted resetPosition的时候不处理onScroll
        */
        let isMounted = false

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
                if (!!find.item) {
                    start = find.index
                    currentScrollTop = liList[start].offsetTop
                    refs.scroll!.refs.wrapper.scrollTop = currentScrollTop
                }
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
                methods.resetPosition()
            },
            onScroll: (e: any) => {
                if (!isMounted) {
                    return;
                }
                if (props.disableChangeOnScroll) {
                    return
                }
                const scrollTop = e.target.scrollTop as number
                if (scrollTop === currentScrollTop) {
                    return;
                }
                currentScrollTop = scrollTop
                let index = Math.max(0, Math.min(options.value.length - 1, Math.floor(currentScrollTop / size)))
                const val = Number(options.value[index])
                if (val != null && val !== model.value && !utils.checkDisabled(val)) {
                    model.value = val
                }
            }
        }

        onMounted(() => {
            methods.resetPosition()
            setTimeout(() => isMounted = true, 300)
        })

        return {
            render: () => (
                <div class="pl-time-base-column">
                    <pl-scroll ref="scroll" onScroll={handler.onScroll}>
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