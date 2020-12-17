import {designComponent} from "../../../../use/designComponent";
import {PropType} from 'vue';
import {PlainTable} from "../../table";

export const PltBody = designComponent({
    name: 'plt-head',
    props: {
        table: {type: Object as PropType<PlainTable>, required: true},
    },
    setup({props}) {
        return {
            render: () => (
                <div>
                    body
                </div>
            )
        }
    },
})