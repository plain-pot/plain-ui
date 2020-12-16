import {designComponent} from "../../../use/designComponent";

export default designComponent({
    name: 'plc',
    props: {},
    setup({props}) {
        return {
            render: () => (
                <div>
                    this is plc
                </div>
            )
        }

    },
})