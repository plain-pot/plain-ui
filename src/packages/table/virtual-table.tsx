import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useRefs} from "../../use/useRefs";
import {PropType} from 'vue';
import {SimpleObject} from "../../shims";
import {useScopedSlots} from "../../use/useScopedSlots";
import {useVirtualList} from "../virtual-list/useVirtualList";
import {useStyles} from "../../use/useStyles";
import {unit} from "plain-utils/string/unit";
import {PlScroll} from "../scroll/scroll";

// const scrollbarSize = 12;

export const PlVirtualTable = designComponent({
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
            scroll: PlScroll,
            content: HTMLDivElement,
            summary: HTMLDivElement,
        })

        const {virtual} = useVirtualList({props, refs, emit, transform: false})

        /*---------------------------------------computed-------------------------------------------*/
        const styles = useStyles(style => {
            style.height = unit(props.height)
        })
        const tableStyles = useStyles((style) => {
            !!props.width && (style.width = unit(props.width))
        })

        const summaryTableStyles = useStyles((styles) => {
            Object.assign(styles, tableStyles.value)
            styles.height = `${!props.summaryData ? 0 : props.summaryData.length * props.size}px`
            styles.bottom = `0px`
        })

        const strutStyles = useStyles(style => {
            Object.assign(style, virtual.strutStyles.value)
            !!props.width && (style.width = unit(props.width));
            style.paddingBottom = `${(props.summaryData || []).length * props.size + 8}px`
        })

        const handler = {
            onScroll: (e: any) => {
                virtual.handler.onScroll(e)
                !!refs.summary && (refs.summary.scrollLeft = e.target.scrollLeft)
            }
        }

        return {
            refer: {
                refs
            },
            render: () => {
                const {list} = virtual.offsetData.value
                return (
                    <div style={styles.value} class="pl-virtual-table">
                        <PlScroll
                            refreshState={props.width}
                            ref="scroll"
                            disableListTransition
                            onScroll={handler.onScroll}
                            scrollX
                            class={virtual.classes.value}
                            horizontalScrollbarTooltip={'推荐【表头使用鼠标滚轮】，或者【表体Alt键+鼠标滚轮】横向滚动'}
                            v-slots={{
                                default: () => (<div class="pl-virtual-list-strut" style={strutStyles.value}>
                                    <div class="pl-virtual-list-content" ref="content" style={virtual.contentStyles.value}>
                                        <table {...{cellpadding: 0, cellspacing: 0, border: 0, style: tableStyles.value}}>
                                            {slots.colgroup()}
                                            {list.map((node) => scopedSlots.default(node))}
                                        </table>
                                    </div>
                                </div>),
                                content: () => (
                                    !props.summaryData || props.summaryData.length === 0 ? null :
                                        <div class="pl-virtual-table-summary-table-wrapper" ref="summary">
                                            <table {...{cellpadding: 0, cellspacing: 0, border: 0, style: summaryTableStyles.value}}
                                                   class="pl-virtual-table-summary-table">
                                                {slots.colgroup()}
                                                {!props.summaryData ? null : props.summaryData.map((item, index) => scopedSlots.default({item, index}))}
                                            </table>
                                        </div>
                                ),
                            }}/>
                    </div>
                )
            }
        }
    },
})