import {designComponent} from "../../use/designComponent";

export default designComponent({
    name: 'pl-select-option',
    props: {
        label: {type: String},
        val: {type: String},
        icon: {type: String},
        disabled: {type: Boolean},
    },
    setup() {
        return {
            render: () => {
                return (
                    <div>
                        option
                    </div>
                )
            }
        }
    },
})