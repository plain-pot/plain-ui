import {getCellClass, TableComponentMixin} from "./table-utils";
import {Plc} from "../plc/plc-utils";

export default {
    name: 'plt-head-cell',
    mixins: [
        TableComponentMixin,
    ],
    props: {
        plc: {type: Object},
    },
    render(h) {
        const plc = this.plc as Plc
        return (
            <th class={this.classes} colspan={plc.colspan} rowspan={plc.rowspan} style={this.styles}>
                <span class="plt-head-cell-indicator" start/>
                {plc.title}
                <span class="plt-head-cell-indicator" end/>
            </th>
        )
    },
    computed: {
        classes() {
            return [
                'plt-head-cell',
                'plt-cell',
                ...getCellClass(this, this.plc, this.rowData),
            ]
        },
        styles() {
            const height = `${this.plTable.headRowHeight}px`
            const width = `${this.plc.props.width}px`
            return {
                height,
                width,
            }
        },
    },
}