import {PlainLoading} from 'plain-loading/src/index'
import {designComponent} from "../../use/designComponent";

export default designComponent({
    name: 'pl-loading',
    props: {
        loading: {type: Boolean, default: true},
        type: {type: String, default: 'alpha'},
        status: {type: String, default: null},
    },
    setup({props}) {


        return {
            render: () => {
                return 'pl-loading'
            }
        }
    },
})