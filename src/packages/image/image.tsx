import {designComponent} from "../../use/designComponent";

export const PlImage = designComponent({
    name: 'pl-image',
    props: {},
    setup({props}) {
        return {
            render: () => (
                <div>
                    this is image
                </div>
            )
        }
    },
})