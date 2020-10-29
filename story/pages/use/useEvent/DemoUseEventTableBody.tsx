import {designComponent} from "../../../../src/use/designComponent";
import {DemoUseEventTable, DemoUseEventTablePart} from "./DemoUseEventTable";
import {onBeforeUnmount, ref} from 'vue';

export const DemoUseEventTableBody = designComponent({
    setup() {

        const wrapperEl = ref(null as null | HTMLInputElement)
        const table = DemoUseEventTable.use.inject()

        const handler = {
            scroll: (e: Event, part: DemoUseEventTablePart) => {
                if (part === DemoUseEventTablePart.head) {
                    wrapperEl.value!.scrollLeft = (e.target as HTMLDivElement).scrollLeft
                }
            },
            wrapperScroll: (e: Event) => {
                if (table.state.part === DemoUseEventTablePart.body) {
                    table.event.emit.scroll(e, DemoUseEventTablePart.body)
                }
            }
        }

        table.event.on.scroll(handler.scroll)
        onBeforeUnmount(() => table.event.off.scroll(handler.scroll))

        return {
            render: () => (
                <div class="demo-use-event-table-body" ref={wrapperEl} onScroll={handler.wrapperScroll}>
                    <div class="demo-use-event-table-body-inner">
                        table <br/> body
                    </div>
                </div>
            )
        }
    },
})