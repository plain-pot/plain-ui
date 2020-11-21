import {designComponent} from "../../use/designComponent";
import './carousel.scss'

export default designComponent({
    name: 'pl-carousel',
    props: {},
    setup({props}) {
        return {
            render: () => (
                <div class="pl-carousel">
                    this is carousel
                </div>
            )
        }
    },
})