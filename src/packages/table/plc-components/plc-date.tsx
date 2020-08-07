import {definePlc, getBinding} from "@/packages/table/plc-components/register";

export default definePlc({
    name: 'plc-date',
    props: {
        width: {default: 150},
        edit: {
            type: Function,
            default: function ({plc, row}) {
                return (
                    <pl-date {...getBinding(row, plc.props.field!)}/>
                )
            }
        },
    },
})