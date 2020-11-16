import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {computed, onMounted} from 'vue';
import {createError} from "../../utils/createError";
import {useRefs} from "../../use/useRefs";
import {getElement} from "../../utils/getElement";

const error = createError('pl-popper')

export default designComponent({
    name: 'pl-popper',
    props: {},
    emits: {},
    setup({props, event: {emit}}) {

        const {refs} = useRefs({
            reference: HTMLElement
        })

        const {slots} = useSlots()

        const reference = computed(() => {
            const slot = slots.default() as any
            if (slot.length > 1) {
                error('allows only one child node!')
            }
            return slot[0]
        })

        onMounted(() => {
            console.log({
                reference: getElement(refs.reference)
            })
        })

        return {
            render: () => {
                const {value: Reference} = reference
                return (
                    <>
                        <Reference ref="reference"/>
                        <div class="pl-popper">
                            popper content
                        </div>
                    </>
                )
            }
        }
    },
})