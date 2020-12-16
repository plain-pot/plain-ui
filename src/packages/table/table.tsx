import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import './table.scss'

export default designComponent({
    name: 'pl-table',
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