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

        const state = reactive({
            nodes: [] as DataNode[],
            scrollTop: 0,
            pageSize: 0,
        })

        const utils = {
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

        const offsetData = computed(() => {

            if (!state.pageSize) {
                return {
                    nodes: [],
                    pageIndex: 0,
                }
            }

            let scrollIndex = utils.getIndex(state.scrollTop)
            // console.log('offsetData:::scrollIndex', scrollIndex)
            let pageIndex = Math.floor(scrollIndex / state.pageSize)
            // console.log('offsetData:::pageIndex', pageIndex)
            const totalPages = state.nodes.length / state.pageSize
            let pages = totalPages === 1 || (pageIndex === totalPages) ? [pageIndex] : [pageIndex, pageIndex + 1]

            const remainNodes = pages.reduce((prev: DataNode[], pageIndex) => {
                prev.push(...state.nodes.slice(pageIndex * state.pageSize, pageIndex * state.pageSize + state.pageSize))
                return prev
            }, [] as DataNode[])

            return {
                nodes: remainNodes,
                pageIndex,
            }
        })

        const strutStyles = useStyles(style => {
            style.height = `${state.nodes.length * props.size}px`
            style.paddingTop = `${offsetData.value.pageIndex * state.pageSize * props.size}px`
        })

        const handler = {
            scroll: (e: Event) => {
                state.scrollTop = (e.target as HTMLDivElement).scrollTop
            }
        }

        watch(() => props.data, (data: any[]) => utils.resetData(data))

        onMounted(() => {
            utils.resetData(props.data)
            const hostHeight = refs.scroll!.refs.host.offsetHeight
            state.pageSize = hostHeight / props.size
            // console.log('onMounted:::state.pageSize', state.pageSize)
        })

        return {
            render: () => {
                const {nodes} = offsetData.value
                return (
                    <pl-scroll onScroll={handler.scroll} ref="scroll">
                        <div class="pl-virtual-list-strut" style={strutStyles.value}>
                            {nodes.map((node, virtualIndex) =>
                                scopedSlots.default({item: node.data, index: node.index, virtualIndex})
                            )}
                        </div>
                    </pl-scroll>
                )
            }
        }
    },
})