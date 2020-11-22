import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {CarouselCollector} from "./carousel";
import {useRefs} from "../../use/useRefs";
import {onMounted, reactive, computed} from 'vue';

export default designComponent({
    name: 'pl-carousel-item',
    props: {
        val: {type: [String, Number]},
    },
    setup({props}) {

        const {refs} = useRefs({
            el: HTMLDivElement,
        })
        const carousel = CarouselCollector.child({sort: () => refs.el})
        const {slots} = useSlots()
        const state = reactive({
            index: 0,
        })
        const value = computed(() => props.val == null ? state.index : props.val)

        onMounted(() => {
            state.index = Array.from(refs.el.parentElement!.childNodes).filter(node => node.nodeType != 3).indexOf(refs.el)
        })

        return {
            refer: {
                value,
            },
            render: () => (
                <div class="pl-carousel-item" ref="el">
                    {value.value} - {slots.default()}
                </div>
            )
        }
    },
})