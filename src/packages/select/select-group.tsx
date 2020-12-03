import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";

export default designComponent({
    name: 'pl-select-group',
    props: {
        label: {type: String},
    },
    setup({props}) {

        const {slots} = useSlots(['label'], true)

        return {
            render: () => {
                return (
                    <>
                        {slots.label.isExist() || !!props.label && (
                            <pl-select-option class="pl-select-group" group>
                                {slots.label(props.label)}
                            </pl-select-option>
                        )}
                        {slots.default()}
                    </>
                )
            }
        }
    },
})