import {, designComponent, onBeforeUnmount, onMounted, PropType, reactive, useRefs, useStyles} from "plain-ui-composition"

import {TabData} from "./tabs.utils";

export const PlTabsHeader = designComponent({
    props: {
        tabs: {type: Array as PropType<TabData[]>, required: true},
    },
    emits: {
        onClickTabHead: (tab: TabData) => true,
    },
    setup({props, event: {emit}}) {

        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
            list: HTMLDivElement,
        })

        const state = reactive({
            offsetData: {
                listLeft: 0,                    // list元素当前left值
                hostWidth: 0,                   // 容器宽度
                totalWidth: 0,                  // 总的item宽度
                children: [] as { left: number, width: number }[],
            },
        })

        const utils = {
            refreshOffsetData: () => {
                const {offsetWidth} = refs.el!
                const {children} = refs.list!
                state.offsetData.hostWidth = offsetWidth;
                state.offsetData.children = (Array.from(children) as HTMLDivElement[]).reduce((prev, item, index) => {
                    const {offsetLeft, offsetWidth} = item
                    /*最后一个是 indicator，所以这里找最后一个child是-2*/
                    if (index === children.length - 2) {state.offsetData.totalWidth = offsetLeft + offsetWidth}
                    prev.push({left: offsetLeft, width: offsetWidth})
                    return prev
                }, [] as { left: number, width: number }[])
            }
        }

        const handler = {
            onMousewheel: (e: WheelEvent) => {
                e.stopPropagation()
                e.preventDefault()
                const {totalWidth, hostWidth, listLeft} = state.offsetData
                if (totalWidth < hostWidth) {return}
                const delta = ((Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY))
                let target = listLeft - delta
                if (target > 0) {
                    target = 0
                } else if (target < (hostWidth - totalWidth)) {
                    target = hostWidth - totalWidth
                }
                state.offsetData.listLeft = target
            }
        }

        const listStyles = useStyles(style => {
            style.left = `${state.offsetData.listLeft}px`
        })
        const indicatorStyle = useStyles(style => {
            const index = props.tabs.findIndex(i => i.active)
            if (index == null || index === -1) return
            const el = state.offsetData.children[index]
            if (!el) return;
            const {left, width} = el
            style.left = `${left}px`
            style.width = `${width}px`
        })

        let refreshTimer: number;
        onMounted(() => {
            refreshTimer = setInterval(() => utils.refreshOffsetData(), 1000) as any as number

            refs.el!.addEventListener('wheel', handler.onMousewheel)
        })
        onBeforeUnmount(() => {
            clearInterval(refreshTimer)

            refs.el!.removeEventListener('wheel', handler.onMousewheel)
        })

        return {
            render: () => (
                <div class="pl-tabs-header" ref={onRef.el}>
                    <div class="pl-tabs-header-list" style={listStyles.value} ref={onRef.list}>
                        {props.tabs.map((tab, index) => (
                            <div class={([
                                'pl-tabs-header-item',
                                {'pl-tabs-header-item-active': tab.active}
                            ])} key={index}
                                 onClick={() => emit.onClickTabHead(tab)}
                            >
                                {tab.item.scopeSlots.head({active: false}, tab.item.props.title)}
                            </div>
                        ))}
                        <i class="pl-tabs-header-indicator" style={indicatorStyle.value}/>
                    </div>
                </div>
            )
        }
    },
})
