import {designComponent} from "../../use/designComponent";
import {$image} from "./service";

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
}, {
    $image,
})