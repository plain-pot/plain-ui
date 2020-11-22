import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {CarouselCollector} from "./carousel";
import {useRefs} from "../../use/useRefs";
import {computed} from 'vue';
import {useStyles} from "../../use/useStyles";
import {createCounter} from "../../utils/createCounter";

const counter = createCounter('carousel')

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
        const itemVal = computed(() => props.val == null ? counter() : props.val)
        const style = useStyles(() => carousel.utils.getItemStyles(itemVal.value) as any)

        return {
            refer: {
                itemVal,
            },
            render: () => (
                <div class={[
                    'pl-carousel-item',
                    {
                        'pl-carousel-item-animating': carousel.utils.isAnimating(itemVal.value),
                    }
                ]}
                     ref="el"
                     style={style.value}>
                    {slots.default()}
                </div>
            )
        }
    },
})