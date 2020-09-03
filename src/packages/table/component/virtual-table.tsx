import {computed, defineComponent, reactive, watch} from "@vue/composition-api";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {useRefs} from "@/use/useRefs";
import {PlainScroll} from "@/packages/scroll/scroll";
import {$plain} from "@/packages/base";
import {VirtualListProps, virtualListSetup} from "@/packages/virtual-list/virtual-list";
import {useRefer} from "@/use/useRefer";

const Props = {
    ...VirtualListProps,

    summaryData: {type: Array},                                 // 合计行数据
    width: {type: Number},                                      // 表格总宽度
    scrollProps: {type: Object},                                // scroll 滚动条属性
}

function setup(props: ExtractPropTypes<typeof Props>) {

    const refs = useRefs({
        scroll: {} as PlainScroll,
    })

    const state = reactive({
        scrollFlag: false,
        scrollLeft: 0,
    })

    const virtualList = virtualListSetup(props)

    const utils = {
        disabledQueenAnimation: $plain.utils.debounce(() => state.scrollFlag = false, 300),
    }

    /*---------------------------------------computer-------------------------------------------*/

    const tableStyles = computed(() => ({
        width: `${props.width}px`,
    }))

    const summaryTableStyles = computed(() => {
        return {
            ...tableStyles.value,
            left: `${-state.scrollLeft}px`,
            height: `${props.summaryData!.length * props.size!}px`
        }
    })

    const strutStyles = computed(() => {
        if (virtualList.isDisabled.value) return null
        const dataHeight = (props.data || []).length * props.size
        const summaryHeight = (!!props.summaryData && props.summaryData.length > 0) ? (props.summaryData.length * props.size) : 0
        return {
            height: `${dataHeight + summaryHeight + 6}px`
        }
    })

    const contentStyles = computed(() => {
        const summaryHeight = (props.summaryData || []).length * props.size
        const offset = virtualList.isDisabled.value ? 0 : virtualList.state.offset
        return {
            top: `${offset}px`,
            paddingBottom: `${summaryHeight}px`,
        }
    })

    /*---------------------------------------handler-------------------------------------------*/

    const handler = {
        scroll: (e) => {
            state.scrollFlag = true
            utils.disabledQueenAnimation()
            state.scrollLeft = e.currentTarget.scrollLeft
            virtualList.handler.scroll(e)
        }
    }

    watch(() => props.width, () => $plain.nextTick(() => refs.scroll.methods.refresh()))

    const refer = {
        refs,
        state,
        virtualList,
        tableStyles,
        summaryTableStyles,
        strutStyles,
        contentStyles,
        handler,
    }

    useRefer(refer)

    return refer
}

export type PlainVirtualTable = ReturnType<typeof virtualListSetup>

export default defineComponent({
    name: 'pl-virtual-table',
    props: {
        ...Props
    },
    setup(props) {

        const {
            state,
            virtualList,
            tableStyles,
            summaryTableStyles,
            strutStyles,
            contentStyles,
            handler,
        } = setup(props)

        return () => {
            const horizontalScrollbar = ({style, onMousedown}) => {
                return (
                    <div
                        {...{directives: [{name: 'tooltip', value: '在【表头】使用【鼠标滚轮】或者在【表体】中使用【ALT + 鼠标滚动】以横向滚动'}]}}
                        class="pl-horizontal-scrollbar"
                        style={style}
                        onMousedown={onMousedown}>
                    </div>
                )
            }

            return (
                <div class={[...virtualList.classes.value, 'pl-virtual-table']}>
                    <pl-scroll ref="scroll" onScroll={handler.scroll} scrollX={true} {...{
                        props: props.scrollProps, scopedSlots: {'horizontal-scrollbar': horizontalScrollbar}
                    }}>
                        <div class="pl-virtual-list-strut" style={{...strutStyles.value, width: `${props.width}px`}}>
                            <div class="pl-virtual-list-content" style={contentStyles.value}>
                                <table cellspacing={0}
                                       cellpadding={0}
                                       border={0}
                                       style={tableStyles.value}>
                                    {virtualList.targetData.value.map(({item, index}) => !virtualList.$scopedSlots.default ? null : virtualList.$scopedSlots.default({item, index, isSummary: false}))}
                                </table>
                            </div>
                        </div>
                    </pl-scroll>
                    {(!!props.summaryData && props.summaryData.length > 0) && (
                        <table class="pl-virtual-table-summary-table"
                               style={summaryTableStyles.value}
                               cellspacing={0}
                               cellpadding={0}
                               border={0}
                        >
                            {props.summaryData.map((item, index) => !virtualList.$scopedSlots.default ? null : virtualList.$scopedSlots.default({item, index, isSummary: true}))}
                        </table>
                    )}
                </div>
            )
        }
    },
})