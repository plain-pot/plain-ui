import {designComponent} from "../../use/designComponent";

export default designComponent({
    name: 'pl-nav-page',
    props: {},
    setup({props}) {
        return {
            render: () => {
                return (
                    <div>
                        this is nav page
                    </div>
                )
            }
        }
    },
})