import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useRefs} from "../../use/useRefs";
import Scroll from '../scroll'
import {computed, PropType} from 'vue';
import {SimpleObject} from "../../shims";
import {useScopedSlots} from "../../use/useScopedSlots";
import {useVirtualList} from "../virutal-list/useVirtualList";
import {useStyles} from "../../use/useStyles";
import {unit} from "plain-utils/string/unit";

export const VirtualTable = designComponent({
    name: 'pl-virtual-table',
    props: {
        data: {type: Array as PropType<SimpleObject[]>, require: true, default: []},// 要渲染的长数据
        size: {type: Number, require: true, default: 40},           // 每一行高度
        dynamicSize: {type: Boolean},                               // 标识列表中的每一行高度不是固定的，但是还是需要提供 size 属性，而且size属性不能与每一行的高度差距太多；
        disabled: {type: Boolean},                                  // 禁用虚拟滚动

        summaryData: {type: Array as PropType<SimpleObject[]>},     // 合计行数据
        width: {type: Number},                                      // 宽度
        height: {type: Number},                                     // 高度
    },
    emits: {
        onScroll: (e: Event) => true
    },
    setup({props, event: {emit}}) {

        const {slots} = useSlots(['colgroup'])
        const {scopedSlots} = useScopedSlots({default: {item: Object, index: Number}})
        const {refs} = useRefs({
            scroll: Scroll,
            content: HTMLDivElement,
        })

        const {virtual} = useVirtualList({props, refs, emit,})

        /*---------------------------------------computed-------------------------------------------*/
        const styles = useStyles(style => {
            style.height = unit(props.height)
        })
        const tableStyles = computed(() => ({
            width: `${props.width}px`,
        }))

        return {
            render: () => {

                const {list} = virtual.offsetData.value

                return (
                    <div style={styles.value}>
                        <Scroll ref="scroll" disableListTransition onScroll={virtual.handler.onScroll} scrollX class={virtual.classes.value}>
                            <div class="pl-virtual-list-strut" style={virtual.strutStyles.value}>
                                <div class="pl-virtual-list-content" ref="content" style={virtual.contentStyles.value}>
                                    <table {...{cellpadding: 0, cellspacing: 0, border: 0, style: tableStyles.value}}>
                                        {slots.colgroup()}
                                        {list.map((node) => scopedSlots.default(node))}
                                    </table>
                                </div>
                            </div>
                        </Scroll>
                    </div>
                )
            }
        }
    },
})