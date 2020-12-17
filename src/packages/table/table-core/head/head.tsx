import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from '../../table'
import {renderColgroup} from "../../plc-format/renderColgroup";
import {PropType} from 'vue';

export const PltHead = designComponent({
    name: 'plt-head',
    props: {
        table: {type: Object as PropType<PlainTable>, required: true}
    },
    setup({props}) {
        const table = props.table
        return {
            render: () => (
                <div class="plt-head">
                    {/*这里不能加 scrollY={false}，会导致sticky固定失效*/}
                    <pl-scroll
                        ref="scroll"
                        scrollX
                        fitContentHeight
                        hideScrollbar
                    >
                        <table class="plt-table plt-head-table">
                            {renderColgroup(table.plcData!.flatPlcList)}
                            <thead>
                            {table.plcData!.headCols.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} colspan={cell.colspan} rowspan={cell.rowspan}>
                                            {cell.props.title}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                        </table>
                    </pl-scroll>
                </div>
            )
        }
    },
})