import './virtual-list.scss'
import {designComponent} from "../../use/designComponent";
import {useScopedSlots} from "../../use/useScopedSlots";
import {useRefs} from "../../use/useRefs";
import Scroll from '../scroll'
import {reactive, computed, watch, nextTick, onUpdated, onMounted} from 'vue';
import {useStyles} from "../../use/useStyles";
import {useClass} from "../../use/useClasses";

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
        dynamicSize: {type: Boolean},                               // 标识列表中的每一行高度不是固定的，但是还是需要提供 size 属性，而且size属性不能与每一行的高度差距太多；
        disabled: {type: Boolean},                                  // 禁用虚拟滚动
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
            content: HTMLDivElement,
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
        const offsetData = computed((): { list: { item: any, index: number }[], startPageIndex: number, start: number } => {

            const {pageSize, scrollTop} = state
            const data = props.data || []

            if (!pageSize) {
                return {list: [], startPageIndex: 0, start: 0}
            }
            if (props.disabled) {
                return {
                    list: data.map((item, index) => ({item, index})),
                    start: 0,
                    startPageIndex: 0,
                }
            }

            /*当前scrollTop对应的数据中数据的索引*/
            let scrollIndex = utils.getIndex(scrollTop)
            let pageIndex = Math.floor(scrollIndex / pageSize)
            let start = pageIndex === 0 ? 0 : (pageIndex - 1) * pageSize
            let end = start + pageSize * 3
            /*console.log({
                scrollIndex,
                pageIndex,
                start,
                end,
            })*/
            const exceed = end - data.length
            if (exceed > 0) {
                end = data.length
                start -= exceed
                if (start < 0) {
                    start = 0
                }
            }
            pageIndex = Math.floor(start / pageSize)
            return {
                list: data.map((item, index) => ({item, index})).slice(start, end),
                startPageIndex: pageIndex,
                start,
            }
        })

        /*---------------------------------------style-------------------------------------------*/

        const classes = useClass(() => [
            'pl-virtual-list',
            {
                'pl-virtual-list-disabled': props.disabled,
            }
        ])

        const strutStyles = useStyles(style => {
            if (!state.pageSize) {
                return
            }
            if (props.disabled) {
                return;
            }
            if (!props.dynamicSize) {
                style.height = `${(props.data || []).length * props.size}px`
            } else {
                style.height = `${state.nodes[state.nodes.length - 1].bottom}px`
            }
        })

        const contentStyles = useStyles(style => {

            if (!state.pageSize) {
                return
            }
            if (props.disabled) {
                return;
            }

            const {startPageIndex, start} = offsetData.value

            let top = 0
            if (!props.dynamicSize) {
                top = (startPageIndex) * state.pageSize * props.size
                // console.log('not dynamic》》》top', top)
            } else {
                top = state.nodes[start].top
                // console.log('is dynamic===top', top)
            }

            /*top定位*/
            // style.top = `${top}px`
            /*transform定位*/
            style.transform = `translateY(${top}px)`
        })

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            /**
             * 根据top值，对比DataNodes中节点的top以及bottom得到在data nodes中的位置索引
             * @author  韦胜健
             * @date    2020/11/15 9:29
             */
            getIndex: (top: number) => {
                if (!props.dynamicSize) {
                    // console.log('not dynamic》》》getIndex', top / props.size)
                    return Math.floor(top / props.size)
                } else {
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
                    // console.log('is dynamic》》》getIndex', temp)
                    return temp
                }
            },
            /**
             * 格式化props.data为 DataNode数组
             * @author  韦胜健
             * @date    2020/11/15 9:29
             */
            resetData: (data: any[]) => {
                // console.log('resetData')
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

                if (props.disabled) {
                    return
                }

                state.scrollTop = (e.target as HTMLDivElement).scrollTop
            }
        }

        watch(() => props.data, (data: any[]) => {
            if (props.disabled) {
                return
            }
            if (!props.dynamicSize) {
                return;
            }
            !!refs.scroll && refs.scroll.methods.scrollTop(0, 0);
            /*如果是动态高度，则刷state.nodes*/
            utils.resetData(data)
        })

        onMounted(() => {
            const hostHeight = refs.scroll!.refs.host.offsetHeight
            state.pageSize = Math.ceil(hostHeight / props.size)
            if (props.dynamicSize && !props.disabled) {
                utils.resetData(props.data)
            }
        })

        onUpdated(async () => {
            if (props.disabled) {
                return
            }
            if (!props.dynamicSize) {
                return;
            }
            await nextTick()
            // console.log('dynamic scan height')
            const elNodes = (Array.from(refs.content.childNodes || []) as HTMLElement[]).filter(node => node.nodeType !== 3)
            for (let i = 0; i < elNodes.length; i++) {
                const el = elNodes[i];
                const {offsetHeight: height} = el
                let vid = el.getAttribute('vid') as null | number | string
                if (vid == null) {
                    throw new Error('Each item of the virtual-list must have an attribute named "vid", please set :vid="index"')
                }
                vid = Number(vid)
                const prevNode = state.nodes[vid]
                const prevHeight = prevNode.height
                let deltaHeight = prevHeight - height
                if (deltaHeight !== 0) {
                    prevNode.height = height
                    prevNode.bottom = prevNode.bottom - deltaHeight
                    for (let j = vid + 1; j < state.nodes!.length; j++) {
                        state.nodes![j].top = state.nodes![j - 1].bottom
                        state.nodes![j].bottom = state.nodes![j].bottom - deltaHeight
                    }
                }
            }
        })

        return {
            render: () => {
                const {list} = offsetData.value
                return (
                    <pl-scroll onScroll={handler.scroll} ref="scroll" class={classes.value}>
                        <div class="pl-virtual-list-strut" style={strutStyles.value}>
                            <div class="pl-virtual-list-content" style={contentStyles.value} ref="content">
                                {list.map((node, virtualIndex) =>
                                    scopedSlots.default({item: node.item, index: node.index, virtualIndex})
                                )}
                            </div>
                        </div>
                    </pl-scroll>
                )
            }
        }
    },
})