import {useClasses, computed, onMounted, onUpdated, reactive, useStyles, watch} from "plain-ui-composition";
import {PlScroll} from "../PlScroll";
import {delay} from "plain-utils/utils/delay";
import './virtual-list.scss'

interface DataNode {
    top: number
    bottom: number
    height: number

    data: any
    index: number
}

export function useVirtualList(
    {
        props,
        refs,
        emit,
        transform,
    }: {
        props: {
            data: any[],
            size: number,
            disabled?: boolean,
            dynamicSize?: boolean,
        },
        refs: {
            scroll?: typeof PlScroll.use.class,
            content?: HTMLDivElement,
        },
        emit: {
            onScroll: (e: Event) => void
        },
        transform?: boolean,
    }
) {

    /*非响应式属性*/
    const freezeState = {
        scrollTop: 0,                               // 实时的scrollTop值
        current: {                                  // 当前的页面信息
            pageIndex: 0,
            start: 0,
            end: 0,
        },
    }
    /*响应式属性*/
    const state = reactive({
        nodes: [] as DataNode[],                    // 格式化的data数组数据
        scrollTop: 0,                               // 当前滚动scrollTop（非实时的）
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
        const {start, end, pageIndex} = utils.getPageIndex(scrollTop, pageSize)
        return {
            list: data.map((item, index) => ({item, index})).slice(start, end),
            startPageIndex: pageIndex,
            start,
        }
    })

    /*---------------------------------------style-------------------------------------------*/

    /**
     * 跟节点Scroll的class
     * @author  韦胜健
     * @date    2020/12/16 10:48
     */
    const classes = useClasses(() => [
        'pl-virtual-list',
        {
            'pl-virtual-list-disabled': props.disabled,
        }
    ])

    /**
     * 占位节点strut的样式
     * @author  韦胜健
     * @date    2020/12/16 10:48
     */
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

    /**
     * 内容（位移）节点的样式
     * @author  韦胜健
     * @date    2020/12/16 10:48
     */
    const contentStyles = useStyles(style => {

        if (!state.pageSize) {
            return
        }
        if (props.disabled) {
            return;
        }

        const {start} = offsetData.value

        let top = 0
        if (!props.dynamicSize) {
            top = start * props.size
        } else {
            top = state.nodes[start].top
        }

        if (transform !== false) {
            /*transform定位*/
            style.transform = `translateY(${top}px)`
        } else {
            /*top定位*/
            style.top = `${top}px`
        }
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
         * 根据scrollTop以及pageSize获取当前的pageIndex
         * @author  韦胜健
         * @date    2020/12/14 22:44
         */
        getPageIndex: (scrollTop: number, pageSize: number) => {
            const data = props.data || []
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
                data,
                start,
                end,
                pageIndex,
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
        onScroll: (e: Event) => {
            emit.onScroll(e)
            if (props.disabled) {
                return
            }
            freezeState.scrollTop = (e.target as HTMLDivElement).scrollTop
            const current = utils.getPageIndex((e.target as HTMLDivElement).scrollTop, state.pageSize)
            if (freezeState.current.pageIndex != current.pageIndex || freezeState.current.start != current.start) {
                state.scrollTop = (e.target as HTMLDivElement).scrollTop
                freezeState.current = current
            }
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
        const hostHeight = refs.scroll!.refs.host!.offsetHeight
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
        await delay()
        // console.log('dynamic scan height')
        const elNodes = (Array.from(refs.content!.childNodes || []) as HTMLElement[]).filter(node => node.nodeType !== 3)
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
        virtual: {
            offsetData,
            classes,
            strutStyles,
            contentStyles,
            handler,
        }
    }
}
