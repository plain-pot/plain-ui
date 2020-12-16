import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import './table.scss'
import {TableProps} from "./table.utils";

export default designComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    setup() {
        const {slots} = useSlots()
        return {
            render: () => {
                return (
                    'this is table'
                )
            }
        }
    },
})