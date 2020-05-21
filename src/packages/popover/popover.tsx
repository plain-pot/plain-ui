import {defineComponent} from "@vue/composition-api";
import {POPPER_PROPS} from "@/packages/popper/popper";


export default defineComponent({
    name: 'pl-popover',
    props: {
        ...POPPER_PROPS,

        /* adjust default props*/
        sizeEqual: {type: Boolean, default: true},
        trigger: {type: String, default: 'click'},
        transition: {type: String, default: 'pl-transition-popper-drop'},
        placement: {type: String, default: 'bottom-start'},
        offset: {type: [Number, String], default: 2},
        arrow: {type: Boolean, default: false},
        height: {type: [Number, String], default: 156},

        scrollProps: {type: Object},
    },
    setup(props, context) {



        return () => (
            <div>

            </div>
        )
    },
})