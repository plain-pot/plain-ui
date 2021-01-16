import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {PlIcon} from "../icon/icon";

export const PlDropdownGroup = designComponent({
    name: 'pl-dropdown-group',
    props: {
        title: {type: String},
    },
    setup({props}) {

        const {slots} = useSlots(['title'], true)

        return {
            render: () => (
                <div class={[
                    'pl-dropdown-group',
                    {'pl-dropdown-no-title': !slots.title.isExist() && !props.title}
                ]}>
                    {slots.title.isExist() || props.title && (
                        <div class="pl-dropdown-group-title">
                            <PlIcon icon="el-icon-list"/>
                            <span>{slots.title(props.title)}</span>
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