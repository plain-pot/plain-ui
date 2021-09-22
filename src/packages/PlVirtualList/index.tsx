import {designComponent, useRefs} from 'plain-ui-composition'
import {PlScroll} from "../PlScroll";
import {useVirtualList} from "./useVirtualList";


export const PlVirtualList = designComponent({
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
    scopeSlots: {
        default: (scope: { item: any, index: number, virtualIndex: number }) => {},
        content: (scope: { data: any[] }) => {},
    },
    setup({props, scopeSlots, event: {emit}}) {

        const {refs, onRef} = useRefs({
            scroll: PlScroll,
            content: HTMLDivElement,
        })

        const {virtual} = useVirtualList({
            refs: refs as any,
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
                    <PlScroll onScroll={virtual.handler.onScroll} ref={onRef.scroll} class={virtual.classes.value} disableListTransition>
                        <div class="pl-virtual-list-strut" style={virtual.strutStyles.value}>
                            <div class="pl-virtual-list-content" style={virtual.contentStyles.value} ref={onRef.content}>
                                {scopeSlots.content({data: list}, list.map((node, virtualIndex) =>
                                    scopeSlots.default({item: node.item, index: node.index, virtualIndex})
                                ))}
                            </div>
                        </div>
                    </PlScroll>
                )
            }
        }
    },
})

export default PlVirtualList
