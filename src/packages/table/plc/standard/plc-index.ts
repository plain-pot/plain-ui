import {designPlc} from "../core/designPlc";

export default designPlc({
    name: 'plc-index',
    render: {
        head: () => '#',
        default: ({node}) => node.index + 1,
        summary: () => '合计行',
    },
    standardProps: {
        autoFixedLeft: {default: true},
        order: {default: -9999},
        width: {default: 40},
        align: {default: 'center'},
        noPadding: {default: true},
    },
    externalProps: {
        summaryText: {type: String, default: '合计'},
    },
})