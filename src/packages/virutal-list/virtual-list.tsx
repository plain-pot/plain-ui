import './virtual-list.scss'
import {designComponent} from "../../use/designComponent";
import {useScopedSlots} from "../../use/useScopedSlots";
import {useRefs} from "../../use/useRefs";
import {useVirtualList} from "./useVirtualList";
import {PlScroll} from "../scroll/scroll";

export const PlVirtualList =  designComponent({
    name: 'pl-virtual-list',
    props: {
        data: {type: Array, require: true, default: []},            // 要渲染的长数据
        size: {type: Number, require: true, default: 40},           // 每一行高度
        dynamicSize: {type: Boolean},                               // 标识列表中的每一行高度不是固定的，但是还是需要提供 size 属性，而且size属性不能与每一行的高度差距太多；
        disabled: {type: Boolean},                                  // 禁用虚拟滚动
    },
    emits: {
        onScroll: (e: Event) => true
    },
    setup({props, event: {emit}}) {

        const {scopedSlots} = useScopedSlots({
            default: {item: Object, index: Number, virtualIndex: Number},
            content: {data: Array},
        })

        const {refs} = useRefs({
            scroll: PlScroll,
            content: HTMLDivElement,
        })

        const {virtual} = useVirtualList({
            refs,
            props,
            emit,
        })

        return {
            refer: {
                refs,
            },
            render: () => {
                const {list} = virtual.offsetData.value
                return (
                    <PlScroll onScroll={virtual.handler.onScroll} ref="scroll" class={virtual.classes.value} disableListTransition>
                        <div class="pl-virtual-list-strut" style={virtual.strutStyles.value}>
                            <div class="pl-virtual-list-content" style={virtual.contentStyles.value} ref="content">
                                {scopedSlots.content({data: list}, list.map((node, virtualIndex) =>
                                    scopedSlots.default({item: node.item, index: node.index, virtualIndex})
                                ))}
                            </div>
                        </div>
                    </PlScroll>
                )
            }
        }
    },
})