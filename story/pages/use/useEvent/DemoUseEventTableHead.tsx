import {designComponent} from "../../../../src/use/designComponent";
import {DemoUseEventTable, DemoUseEventTablePart} from "./DemoUseEventTable";
import {onBeforeUnmount, ref} from 'vue';

export const DemoUseEventTableHead = designComponent({
    setup() {

        const wrapperEl = ref(null as null | HTMLInputElement)
        const table = DemoUseEventTable.use.inject()

        const handler = {
            /**
             * 组件销毁的时候，如果不取消监听事件，则监听的事件一直有效
             * 此时 wrapperEl  节点已经销毁，会导致一直报错
             * @author  韦胜健
             * @date    2020/10/29 16:14
             */
            scroll: (e: Event, part: DemoUseEventTablePart) => {
                // console.log('head handle scroll', Date.now())
                if (part === DemoUseEventTablePart.body) {
                    wrapperEl.value!.scrollLeft = (e.target as HTMLDivElement).scrollLeft
                }
            },
            wrapperScroll: (e: Event) => {
                if (table.state.part === DemoUseEventTablePart.head) {
                    table.event.emit.scroll(e, DemoUseEventTablePart.head)
                }
            },
            mousewheel: (e: MouseWheelEvent) => {
                wrapperEl.value!.scrollLeft = wrapperEl.value!.scrollLeft + e.deltaY
            }
        }

        table.event.on.scroll(handler.scroll)
        onBeforeUnmount(() => table.event.off.scroll(handler.scroll))

        return {
            render: () => (
                <div class="demo-use-event-table-head"
                     ref={wrapperEl}
                     onScroll={handler.wrapperScroll}
                     {...{onMousewheel: handler.mousewheel}}>
                    <div class="demo-use-event-table-head-inner">
                        table head
                    </div>
                </div>
            )
        }
    },
})