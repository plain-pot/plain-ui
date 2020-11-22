import {designComponent} from "../../use/designComponent";
import './carousel.scss'
import {useSlots} from "../../use/useSlots";
import {useProps} from "../../use/useProps";
import {useStyles} from "../../use/useStyles";
import {unit} from "plain-utils/string/unit";

export default designComponent({
    name: 'pl-carousel',
    props: {
        height: {type: [Number, String], default: 300},
    },
    setup({props}) {

        const {slots} = useSlots()
        const {propsState} = useProps(props, {
            height: useProps.NUMBER,
        })

        const styles = useStyles(style => {
            style.height = unit(propsState.height)
        })

        return {
            render: () => (
                <div class="pl-carousel" style={styles.value}>
                    {slots.default()}
                </div>
            )
        }
    },
})