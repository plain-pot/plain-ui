import {defineComponent} from "@vue/composition-api";
import {useCollectChild} from "@/use/useCollect";

export default defineComponent({
    name: 'pl-select-option',
    props: {
        label: {type: String},
        val: {type: String},
        icon: {type: String},
        disabled: {type: String},
    },
    setup(props) {

        useCollectChild()

        return () => <span label={props.label} val={props.val} icon={props.icon} disabled={props.disabled}/>
    },
})