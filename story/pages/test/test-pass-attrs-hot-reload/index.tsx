import {designComponent} from "../../../../src/use/designComponent";
import {useSlots} from "../../../../src/use/useSlots";

const Popper = designComponent({
    props: {
        trigger: {type: String},
        offset: {type: Number},
    },
    setup({props}) {

        const {slots} = useSlots()

        return {
            render: () => (
                <div>
                    {slots.default()}
                    <h2>
                        popper:{props.trigger}-{props.offset}
                    </h2>
                </div>
            )
        }
    },
})


export const TestPassAttrsDropdown = designComponent({
    props: {
        height: {type: Number},
    },
    setup({props}) {
        return {
            render: () => (
                <Popper>
                    <h1>dropdown:{props.height}</h1>
                </Popper>
            )
        }
    },
})
