import {computed, defineComponent, inject, onBeforeUnmount, provide, reactive} from "@vue/composition-api";
import {TABLE_PROVIDER, TableHoverPart} from "@/packages/table/table-utils";
import {PlainTable} from "@/packages/table/table/table";
import {PlcFixedType} from "@/packages/table/plc/plc-utils";
import {PlainTableBodyItem} from "@/packages/table/table/body/body-item";
import {useRefer} from "@/use/useRefer";

export const PLAIN_TABLE_BODY_PROVIDER = '@@PlainTableBodyProvider'

function setup() {
    const table = inject(TABLE_PROVIDER) as PlainTable

    const state = reactive({
        bodyItems: {
            center: null as null | PlainTableBodyItem,
            left: null as null | PlainTableBodyItem,
            right: null as null | PlainTableBodyItem,
        },
        scrollState: {
            scrollTop: 0,
            scrollLeft: 0,
        }
    })

    const styles = computed(() => ({
        height: `${table.props.bodyRowHeight as number * table.props.showRows + 12}px`
    }))

    const has = computed(() => {
        return {
            fixedLeft: table.plcData.value!.hasFixedLeft,
            fixedRight: table.plcData.value!.hasFixedLeft,
        }
    })

    const handler = {
        scrollLeft: (e: Event, part: TableHoverPart) => {
            if (part === TableHoverPart.head && table.state.hoverState.part === TableHoverPart.head) {
                if (!!state.bodyItems.center) {
                    // console.log('scroll left', TableHoverPart.body)
                    state.bodyItems.center!.refs.virtualTable.refs.scroll.methods.scrollLeft((e.target as Element).scrollLeft)
                }
            }
        },
        scroll: (e: Event, fixed: PlcFixedType) => {
            const {part, fixed: hoverFixed} = table.state.hoverState

            if (part !== TableHoverPart.body) {
                return;
            }

            if (fixed !== hoverFixed) {
                return
            }

            if (fixed === PlcFixedType.center) {
                table.emit.scrollLeft(e, TableHoverPart.body)
            }

            Object.values(state.bodyItems).filter(Boolean).forEach((bodyItem) => {
                if (bodyItem!.props.fixed === fixed) return
                /*console.log({bodyItem: bodyItem.fixed,fixed})*/

                bodyItem!.refs.virtualTable.refs.scroll.methods.scrollTop((e.target as HTMLElement).scrollTop)
            })
        },
    }

    table.on.scrollLeft(handler.scrollLeft)

    onBeforeUnmount(() => table.off.scrollLeft(handler.scrollLeft))

    const refer = {
        state,
        styles,
        handler,
        has,
    }

    provide(PLAIN_TABLE_BODY_PROVIDER, refer)
    useRefer(refer)

    return refer
}

export type PlainTableBody = ReturnType<typeof setup>

export default defineComponent({
    name: 'plt-body',
    setup() {
        const {
            styles,
            handler,
            has,
        } = setup()

        return () => (
            <div class="plt-body" style={styles.value}>

                <plt-body-item onScroll={handler.scroll}/>

                {has.value.fixedLeft && (
                    <plt-body-item fixed={PlcFixedType.left} onScroll={handler.scroll}/>
                )}

                {has.value.fixedRight && (
                    <plt-body-item fixed={PlcFixedType.right} onScroll={handler.scroll}/>
                )}

            </div>
        )
    },
})