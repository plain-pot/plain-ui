import {designComponent} from "../../use/designComponent";
import {PropType} from 'vue';
import {PlTabComponent} from "./tab";

export const PlInnerTab = designComponent({
    props: {
        item: {type: Object as PropType<PlTabComponent>, required: true},
        active: {type: Boolean},
    },
    setup({props}) {
        return {
            render: () => (
                <div class="pl-inner-tab" v-show={props.active}>
                    {props.item.slots.default()}
                </div>
            )
        }
    },
})