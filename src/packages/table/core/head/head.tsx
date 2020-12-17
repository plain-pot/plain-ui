import {designComponent} from "../../../../use/designComponent";
import {PropType} from 'vue';
import {PlainTable} from "../../table";

export const PltHead = designComponent({
    name: 'plt-head',
    props: {
        table: {type: Number, required: true},
    },
    setup({props}) {
        return {
            refer:{},
            render: () => (
                <div>
                    head
                </div>
            )
        }
    },
})