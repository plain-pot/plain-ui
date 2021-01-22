import {designComponent} from "../../use/designComponent";
import './image.scss'

export const PlImageUploader = designComponent({
    name: 'pl-image-uploader',
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