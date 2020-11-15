import './virtual-list.scss'
import {designComponent} from "../../use/designComponent";
import {useScopedSlots} from "../../use/useScopedSlots";
import {useRefs} from "../../use/useRefs";
import Scroll from '../scroll'
import {reactive, computed, watch, nextTick, onUpdated, onMounted} from 'vue';
import {useStyles} from "../../use/useStyles";

interface DataNode {
    top: number
    bottom: number
    height: number

    data: any
    index: number
}

export default designComponent({
    name: 'pl-virtual-list',
    props: {
        data: {type: Array, require: true, default: []},            // 要渲染的长数据
        size: {type: Number, require: true, default: 40},           // 每一行高度
    },
    emits: {
        scroll: (e: Event) => true
    },
    setup({props, event: {emit}}) {

        const {scopedSlots} = useScopedSlots({
            default: {item: Object, index: Number, virtualIndex: Number}
        })

        const {refs} = useRefs({
            scroll: Scroll,
        })

        /*---------------------------------------state-------------------------------------------*/

        const state = reactive({
            nodes: [] as DataNode[],                    // 格式化的data数组数据
            scrollTop: 0,                               // 当前滚动scrollTop
            pageSize: 0,                                // 页大小
        })

        /**
         * 计算得到的在虚拟列表当前要渲染的数组数据
         * @author  韦胜健
         * @date    2020/11/15 9:28
         */
        const offsetData = computed((): { nodes: DataNode[], startPageIndex: number } => {
            const {pageSize, scrollTop, nodes} = state
            if (!pageSize) {
                return {nodes: [], startPageIndex: 0,}
            }
            let scrollIndex = utils.getIndex(scrollTop)
            // console.log('offsetData:::scrollIndex', scrollIndex)
            let pageIndex = Math.floor(scrollIndex / pageSize)
            // console.log('offsetData:::pageIndex', pageIndex)
            let start = pageIndex === 0 ? 0 : (pageIndex - 1) * pageSize
            let end = start + pageSize * 3
            const exceed = end - nodes.length
            if (exceed > 0) {
                end = nodes.length
                start -= exceed
                if (start < 0) {
                    start = 0
                }
            }
            pageIndex = start / pageSize
            const keepNodes = nodes.slice(start, end)
            return {
                nodes: keepNodes,
                startPageIndex: pageIndex,
            }
        })

        /*---------------------------------------style-------------------------------------------*/

        const strutStyles = useStyles(style => {
            style.height = `${state.nodes.length * props.size}px`
        })

        const contentStyles = useStyles(style => {
            /*top定位*/
            // style.top = `${(offsetData.value.startPageIndex) * state.pageSize * props.size}px`
            /*transform定位*/
            style.transform = `translateY(${(offsetData.value.startPageIndex) * state.pageSize * props.size}px)`
        })

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            /**
             * 根据top值，对比DataNodes中节点的top以及bottom得到在data nodes中的位置索引
             * @author  韦胜健
             * @date    2020/11/15 9:29
             */
            getIndex: (top: number) => {
                const {nodes} = state
                let start = 0;
                let end = nodes.length - 1
                let temp = 0;
                while (start <= end) {
                    let middle = Math.floor((start + end) / 2)
                    let middleBottom = nodes[middle].bottom
                    if (middleBottom === top) {
                        return middle + 1
                    } else if (middleBottom < top) {
                        start = middle + 1
                    } else if (middleBottom > top) {
                        if (!temp || temp > middle) {
                            temp = middle
                        }
                        end = middle - 1
                    }
                }
                return temp
            },
            /**
             * 格式化props.data为 DataNode数组
             * @author  韦胜健
             * @date    2020/11/15 9:29
             */
            resetData: (data: any[]) => {
                state.nodes = data.map((item, index) => ({
                    data: item,
                    index,
                    top: props.size * index,
                    height: props.size,
                    bottom: props.size * (index + 1),
                }))
            }
        }

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            scroll: (e: Event) => {
                emit.scroll(e)
                state.scrollTop = (e.target as HTMLDivElement).scrollTop
            }
        }

        watch(() => props.data, (data: any[]) => utils.resetData(data))

        onMounted(() => {
            utils.resetData(props.data)
            const hostHeight = refs.scroll!.refs.host.offsetHeight
            state.pageSize = hostHeight / props.size
        })

        return {
            render: () => {
                const {nodes} = offsetData.value
                return (
                    <pl-scroll onScroll={handler.scroll} ref="scroll" class="pl-virtual-list">
                        <div class="pl-virtual-list-strut" style={strutStyles.value}>
                            <div class="pl-virtual-list-content" style={contentStyles.value}>
                                {nodes.map((node, virtualIndex) =>
                                    scopedSlots.default({item: node.data, index: node.index, virtualIndex})
                                )}
                            </div>
                        </div>
                    </pl-scroll>
                )
            }
        }
    },
})