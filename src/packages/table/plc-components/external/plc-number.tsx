import {definePlc, getBinding} from "@/packages/table/plc-components/register";

export default definePlc({
    name: 'plc-number',
    props: {
        width: {default: 150},
        edit: {
            type: Function,
            default: function ({plc, row}) {
                return (
                    <pl-number {...getBinding(row, plc.props.field!)}/>
                )
            }
        },
    },
})