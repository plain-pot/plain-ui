import {designComponent} from "../../use/designComponent";

const Table = designComponent({
    name: 'pl-table',
    props: {},
    setup({props}) {
        return {
            render: () => (
                <div>
                    table
                </div>
            )
        }
    },
})

export default Table