import {definePlc} from "@/packages/table/plc-components/register";

export default definePlc({
    name: 'plc-input',
    props: {
        edit: {
            type: Function,
            default: function (h, {rowData, plc}) {
                return (
                    <pl-input block value={rowData.data[plc.props.field]}/>
                )
            }
        },
    },
})