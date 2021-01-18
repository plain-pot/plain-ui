import {designComponent} from "../../use/designComponent";
import './date.scss'

export const PlDate = designComponent({
    name: 'pl-date',
    props: {},
    setup() {
        return {
            render: () => (
                <div>
                    pl-date
                </div>
            )
        }
    },
})