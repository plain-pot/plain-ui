import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {computed, onMounted, createCommentVNode, Teleport, reactive} from 'vue';
import {createError} from "../../utils/createError";
import {useRefs} from "../../use/useRefs";
import {getElement} from "../../utils/getElement";
import {useModel} from "../../use/useModel";
import {nextIndex} from "../../utils/nextIndex";

const error = createError('pl-popper')

export default designComponent({
    name: 'pl-popper',
    props: {
        modelValue: {type: Boolean},
        open: {type: Boolean},


    },
    emits: {
        updateModelValue: (val: boolean) => true,
        updateOpen: (val: string) => true,
        init: () => true,
        destroy: () => true,
        open: () => true,
        close: () => true,
        show: () => true,
        hide: () => true,

        clickReference: (e: MouseEvent) => true,
        clickPopper: (e: MouseEvent) => true,
        clickBody: (e: MouseEvent) => true,
        mousedownPopper: (e: MouseEvent) => true,

        enterReference: (e: MouseEvent) => true,
        leaveReference: (e: MouseEvent) => true,
        enterPopper: (e: MouseEvent) => true,
        leavePopper: (e: MouseEvent) => true,
        referenceFocus: (e: FocusEvent) => true,
        referenceBlur: (e: Event) => true,
    },
    setup({props, event}) {

        const {emit, on, off} = event

        const {slots} = useSlots()

        const {refs} = useRefs({
            comment: HTMLElement,
            popper: HTMLDivElement,
        });

        const model = useModel(() => props.modelValue, emit.updateModelValue)

        const state = reactive({
            el: {
                popper: null as null | HTMLElement,
                comment: null as null | HTMLElement,
                reference: null as null | HTMLElement,
            },
            zIndex: nextIndex(),
        })

        /*检查默认插槽中是否存在多个节点，如果是则发出警告*/
        const referenceVNode = computed(() => {
            const slot = slots.default() as any
            if (slot.length > 1) {
                error('allows only one child node!')
            }
            return slot[0]
        })

        const popperClasses = computed(() => [
            'plain-popper',
            {
                'plain-popper-show': model.value
            }
        ])

        onMounted(() => {

            const popper = getElement(refs.popper)!
            const comment = getElement(refs.comment)
            const reference = comment!.nextElementSibling as HTMLElement

            state.el = {popper, comment, reference}
        })

        const Comment = createCommentVNode('') as any

        return {
            render: () => {
                const {value: ReferenceVNode} = referenceVNode
                return (
                    <>
                        <Comment ref="comment"/>
                        <ReferenceVNode/>
                        <Teleport to=".pl-root-service-container">
                            <div class={popperClasses.value}
                                 ref="popper">
                                <div class="plain-popper-content"
                                     ref="content"

                                >

                                </div>
                                popper content
                            </div>
                        </Teleport>
                    </>
                )
            }
        }
    },
})