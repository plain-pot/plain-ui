import {computed, defineComponent, inject} from "@vue/composition-api";
import {PlcFixedType} from "@/packages/table/plc/plc-utils";
import {PLT_HEAD_PROVIDER, PltHeadType} from "@/packages/table/table-bak/head/head";
import {TABLE_PROVIDER, TableHoverPart} from "@/packages/table/table-utils";
import {PlainTable} from "@/packages/table/table-bak/table";

export default defineComponent({
    name: 'plt-head-item',
    props: {
        fixed: {type: String, default: PlcFixedType.center}
    },
    setup(props) {

        const head = inject(PLT_HEAD_PROVIDER) as PltHeadType
        const table = inject(TABLE_PROVIDER) as PlainTable

        const classes = computed(() => ([
            'plt-head-item',
            `pl-table-item-fixed-${props.fixed}`,
        ]))

        const tableStyles = computed(() => {
            if (!table.totalContentWidth.value) return
            const flatPlcList = table.bodyPlcList.value!
            let totalWidth = 0
            flatPlcList.forEach(plc => {
                if (plc.props.fixed === props.fixed || props.fixed === PlcFixedType.center) {
                    totalWidth += plc.props.width as number
                }
            })
            return {
                width: `${totalWidth}px`
            }
        })

        const handler = {
            mouseenter: (e) => {
                table.handler.hoverPart(TableHoverPart.head, props.fixed as PlcFixedType)
            }
        }

        return () => (
            <div class={classes.value} onMouseenter={handler.mouseenter}>
                <table cellspacing={0} cellpadding={0} border={0} style={tableStyles.value}>
                    {
                        head.headPlcList.value.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => <plt-head-cell key={cellIndex} plc={cell} fixed={props.fixed}/>)}
                            </tr>
                        ))
                    }
                </table>
            </div>
        )
    },
})