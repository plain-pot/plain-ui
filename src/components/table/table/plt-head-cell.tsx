import {TableComponentMixin} from "./table-utils";
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
            <td class={this.classes} colspan={plc.colspan} rowspan={plc.rowspan} style={this.styles}>
                {plc.title}
            </td>
        )
    },
    computed: {
        classes() {
            return [
                'plt-head-cell',

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