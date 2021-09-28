import {computed, designComponent, InheritHtmlElement, useClasses, useRefs, useStyles} from "plain-design-composition";
import {CarouselCollector} from "../PlCarousel";
import {createCounter} from "plain-utils/utils/createCounter";
import {reactive} from "vue";

const counter = createCounter('carousel')

export const PlCarouselItem = designComponent({
    name: 'pl-carousel-item',
    props: {
        val: {type: [String, Number]},
    },
    inheritPropsType: InheritHtmlElement,
    slots: ['default'],
    setup({props, slots}) {

        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
        })
        const carousel = CarouselCollector.child({sort: () => refs.el!})
        const itemVal = computed(() => props.val == null ? counter() : props.val)
        const styles = useStyles(() => carousel.utils.getItemStyles(itemVal.value) as any)

        const classes = useClasses(() => [
            'pl-carousel-item',
            {'pl-carousel-item-animating': carousel.utils.isAnimating(itemVal.value),}
        ])

        return {
            refer: reactive({
                itemVal,
                refs,
            }),
            render: () => {
                return (
                    <div class={classes.value}
                         ref={onRef.el}
                         style={styles.value}>
                        {slots.default()}
                    </div>
                )
            }
        }
    },
})

export default PlCarouselItem
