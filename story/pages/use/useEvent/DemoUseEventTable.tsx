import {designComponent} from "../../../../src/use/designComponent";
import {DemoUseEventTableHead} from "./DemoUseEventTableHead";
import {DemoUseEventTableBody} from "./DemoUseEventTableBody";
import {reactive} from 'vue';

export enum DemoUseEventTablePart {
    head = 'head',
    body = 'body',
}

export const DemoUseEventTable = designComponent({
    name: 'demo-sue-event-table',
    props: {
        showHeader: {type: Boolean, default: true},
    },
    emits: {
        scroll: (e: Event, part: DemoUseEventTablePart) => true,
    },
    provideRefer: true,
    setup({props, event}) {

        const state = reactive({
            hoverPart: null as null | DemoUseEventTablePart
        })

        return {
            refer: {
                state,
                event,
            },
            render: () => (
                <div class="demo-use-event-table" onMouseleave={() => state.hoverPart = null}>

                    {!!props.showHeader &&
                    <DemoUseEventTableHead
                        onClickHeader={(name) => {
                            name.toFixed(1)
                        }}
                        {...{
                            onMouseenter: () => state.hoverPart = DemoUseEventTablePart.head
                        }}/>}

                    <DemoUseEventTableBody {...{
                        onMouseenter: () => state.hoverPart = DemoUseEventTablePart.body
                    }}/>

                </div>
            )
        }
    },
})