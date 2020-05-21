import {computed, defineComponent} from "@vue/composition-api";
import {POPPER_PROPS} from "@/packages/popper/popper";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {SlotFunc, useSlots} from "@/use/useSlots";


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
    setup(props) {

        const {slots} = useSlots({
            popper: SlotFunc,
        })

        const {emit} = useEvent({
            input: EmitFunc,
        })

        const popperProps = computed(() => {
            const result = Object.keys(POPPER_PROPS).reduce((ret, key) => {
                switch (key) {
                    case 'popperClass':
                        ret[key] = !!props[key] ? ['pl-popover-popper', props[key]].join(' ') : 'pl-popover-popper'
                        break
                    default:
                        ret[key] = props[key]
                        break
                }

                return ret
            }, {})
            // console.log('popperProps', result)
            return result
        })

        const model = useModel(() => props.value, emit.input, false)

        const handler = {
            input: (val) => {
                model.value = val
            },
        }

        return () => (
            <pl-popper class="pl-popover"
                       {...{props: popperProps.value}}
                       value={model.value}
                       noContentPadding
                       onInput={handler.input}
            >
                {slots.default()}
                {slots.popper()}
            </pl-popper>

        )
    },
})