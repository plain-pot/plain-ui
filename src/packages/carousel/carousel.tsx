import {computed, onMounted} from 'vue'
import {designComponent} from "../../use/designComponent";
import './carousel.scss'
import {useSlots} from "../../use/useSlots";
import {useProps} from "../../use/useProps";
import {useStyles} from "../../use/useStyles";
import {unit} from "plain-utils/string/unit";
import Item from './carousel-item'
import {useCollect} from "../../use/useCollect";
import {useModel} from "../../use/useModel";

export const Carousel = designComponent({
    name: 'pl-carousel',
    props: {
        modelValue: {type: [String, Number]},
        height: {type: [Number, String], default: 300},
    },
    emits: {
        updateModelValue: (val: string | number | undefined | null) => true,
    },
    setup({props, event: {emit}}) {

        const items = CarouselCollector.parent()

        const {slots} = useSlots()
        const {propsState} = useProps(props, {
            height: useProps.NUMBER,
        })
        const model = useModel(() => props.modelValue, emit.updateModelValue)
        const vals = computed(() => items.map(item => item.value.value!))
        const activeVal = computed(() => {
            if (vals.value.length === 0) {
                return null
            }
            if (model.value != null) {
                return model.value
            } else {
                return vals.value[0]
            }
        })

        const sortVals = computed(() => {
            if (activeVal.value == null) {
                return []
            }
            const valArray = vals.value
            let activeIndex = valArray.indexOf(activeVal.value)
            let prev = valArray.slice(0, activeIndex)
            let next = valArray.slice(activeIndex + 1)

            if (Math.abs(prev.length - next.length) > 1) {
                if (prev.length > next.length) {
                    while (prev.length - next.length > 1) {
                        next.push(prev.shift()!)
                    }
                } else {
                    while (next.length - prev.length > 1) {
                        prev.unshift(next.pop()!)
                    }
                }
            }
            return [...prev, activeVal.value, ...next]
        })

        const styles = useStyles(style => {
            style.height = unit(propsState.height)
        })

        const utils = {}

        onMounted(() => null)

        return {
            refer: {
                utils,
            },
            render: () => (
                <div class="pl-carousel" style={styles.value}>
                    {slots.default()}
                    <div class="pl-carousel-cover">
                        {JSON.stringify(sortVals.value)}
                    </div>
                </div>
            )
        }
    },
})

export const CarouselCollector = useCollect(() => ({
    parent: Carousel,
    child: Item,
}))