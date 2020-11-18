import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";

export default designComponent({
    name: 'pl-dropdown-group',
    props: {
        title: {type: String},
    },
    setup({props}) {

        const {slots} = useSlots(['title'], true)

        return {
            render: () => (
                <div class="pl-dropdown-group">
                    {slots.title.isExist() || props.title && (
                        <div class="pl-dropdown-group-title">
                            {slots.title(props.title)}
                        </div>
                    )}
                    <div class="pl-dropdown-group-content">
                        {slots.default()}
                    </div>
                </div>
            )
        }
    },
})