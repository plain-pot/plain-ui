import {computed, defineComponent, getCurrentInstance, onUpdated, reactive, watch} from "@vue/composition-api";
import {ElRef, useRefs} from "@/use/useRefs";
import {$plain} from "@/packages/base";
import {useScopedSlots} from "@/use/useScopedSlots";
import {PlainScroll} from "@/packages/scroll/scroll";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {EmitFunc, useEvent} from "@/use/useEvent";

interface DataInfo {
    top: number
    bottom: number
    height: number
}

export const VirtualListProps = {
    data: {type: Array, require: true, default: []},            // 要渲染的长数据
    size: {type: Number, require: true, default: 40},           // 每一行高度
    remain: {type: Number, require: true},                      // 一屏渲染的行数，总共渲染三屏，一屏渲染个数越多，滚动效果越好，但是浏览器卡顿的效果可能更明显；如果不传remain，则根据size以及 pl-virtual-list 跟节点的高度自动计算行数
    dynamicSize: {type: Boolean},                               // 标识列表中的每一行高度不是固定的，但是还是需要提供 size 属性，而且size属性不能与每一行的高度差距太多；
    renderContent: {type: Function},                            // 渲染content节点的渲染函数
    disabled: {type: Boolean},

    contentIs: {},
    contentProps: {},
}

export function virtualListSetup(props: ExtractPropTypes<typeof VirtualListProps>) {

    const {$scopedSlots} = useScopedSlots()
    const {emit} = useEvent({
        scroll: EmitFunc,
    })

    const refs = useRefs({
        scroll: {} as PlainScroll,
        content: ElRef,
    })

    const state = reactive({
        start: 0,
        end: props.remain || 0,
        offset: 0,
        remain: 0,
        dataInfo: null as null | DataInfo[],
    })

    const ctx = getCurrentInstance()!

    /*---------------------------------------computer-------------------------------------------*/

    const isDisabled = computed(() => props.disabled)

    const classes = computed(() => [
        'pl-virtual-list',
        {
            'pl-virtual-list-disabled': isDisabled.value,
        }
    ])

    const targetStart = computed(() => {
        return state.start - Math.min(state.start, state.remain)
    })

    const targetEnd = computed(() => {
        return state.end + Math.min(props.data.length - state.end, state.remain)
    })

    const targetData = computed(() => {
        if (isDisabled.value) {
            return props.data.map((item, index) => ({item, index}))
        }
        if (!state.remain) return []
        return (props.data || []).map((item, index) => ({item, index})).slice(targetStart.value, targetEnd.value)
    })

    const strutStyles = computed(() => {
        if (isDisabled.value) return
        return {
            height: `${!!props.dynamicSize ? state.dataInfo![state.dataInfo!.length - 1].bottom : props.data.length * props.size}px`
        }
    })

    const contentStyles = computed(() => {
        if (isDisabled.value) return
        return {
            transform: `translate3d(0,${state.offset}px,0)`
        }
    })

    const utils = {
        /**
         * 使用二分查找算法，根据当前的scrollTop查找在dataInfo中对应的开始元素
         * @author  韦胜健
         * @date    2020/3/11 14:39
         */
        getStartByDynamic: (scrollTop) => {
            let start = 0;
            let end = state.dataInfo!.length - 1
            let temp = 0;

            while (start <= end) {
                let middle = Math.floor((start + end) / 2)
                let middleBottom = state.dataInfo![middle].bottom
                if (middleBottom === scrollTop) {
                    return middle + 1
                } else if (middleBottom < scrollTop) {
                    start = middle + 1
                } else if (middleBottom > scrollTop) {
                    if (!temp || temp > middle) {
                        temp = middle
                    }
                    end = middle - 1
                }
            }
            return temp
        },
    }

    /*---------------------------------------handler-------------------------------------------*/

    const handler = {
        scroll: (e: any) => {
            if (!isDisabled.value) {
                const scrollTop = e.target!.scrollTop

                if (!props.dynamicSize) {
                    // 固定高度
                    state.start = Math.floor(scrollTop / props.size)
                    state.offset = (targetStart.value) * props.size
                } else {
                    // 动态高度
                    state.start = utils.getStartByDynamic(scrollTop)
                    state.offset = (state.dataInfo![targetStart.value]).top
                }

                state.end = state.start + state.remain
            }

            emit.scroll(e)
        },
    }

    /*---------------------------------------watcher-------------------------------------------*/
    watch(() => props.remain, (val) => {
        if (isDisabled.value) return

        if (!!val) state.remain = val
        else {
            // 自动计算 remain
            $plain.nextTick(() => {
                state.start = 0
                state.remain = Math.floor(refs.$el.offsetHeight / props.size)
                state.end = state.remain
            })
        }
    })
    watch(() => props.data, (val) => {
        if (isDisabled.value) return

        if (!props.dynamicSize) return
        val = val || []
        state.dataInfo = val.map((item, index) => ({
            top: index * props.size,
            height: props.size,
            bottom: props.size * (index + 1),
        }));
        !!refs.scroll && refs.scroll.methods.scrollTop(0, 0)
    })

    onUpdated(async () => {
        if (isDisabled.value) return

        if (!props.dynamicSize) return
        // 页面渲染完成之后，需要根据当前展示的数据，更新缓存的内容
        await $plain.nextTick()

        const content = ((refs.content as any).$el || refs.content) as HTMLElement
        const nodes = Array.from(content.childNodes || []) as HTMLElement[]

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const height = node.offsetHeight
            let vid = node.getAttribute('vid') as null | number | string
            if (vid == null) {
                throw new Error('Each item of the virtual-list must have an attribute named "vid", please set :vid="index"')
            }
            vid = Number(vid)
            const prevDataInfo = state.dataInfo![vid]
            const prevHeight = prevDataInfo.height
            let delta = prevHeight - height
            if (delta !== 0) {
                prevDataInfo.height = height
                prevDataInfo.bottom = prevDataInfo.bottom - delta
                for (let j = vid + 1; j < state.dataInfo!.length; j++) {
                    state.dataInfo![j].top = state.dataInfo![j - 1].bottom
                    state.dataInfo![j].bottom = state.dataInfo![j].bottom - delta
                }
            }
        }
    })

    return {
        $scopedSlots,
        refs,
        state,
        ctx,
        isDisabled,
        classes,
        targetStart,
        targetEnd,
        targetData,
        strutStyles,
        contentStyles,
        utils,
        handler,
    }
}

export default defineComponent({
    name: 'pl-virtual-list',
    props: {
        ...VirtualListProps,
    },
    setup(props) {

        const {
            handler,
            classes,
            strutStyles,
            contentStyles,
            ctx,
            targetData,
            $scopedSlots,
        } = virtualListSetup(props)

        return () => {
            const Content = props.contentIs || 'div' as any

            return (
                <pl-scroll onScroll={handler.scroll} ref="scroll" class={classes.value}>
                    <div class="pl-virtual-list-strut" style={strutStyles.value}>
                        <Content class="pl-virtual-list-content" style={contentStyles.value} ref="content" {...{props: props.contentProps || {}}}>
                            {!!props.renderContent ?
                                props.renderContent(ctx.$createElement, targetData.value) :
                                (!!$scopedSlots.default ? targetData.value.map(({item, index},virtualIndex) => $scopedSlots.default!({item, index,virtualIndex})) : null)}
                        </Content>
                    </div>
                </pl-scroll>
            )
        }
    },
})