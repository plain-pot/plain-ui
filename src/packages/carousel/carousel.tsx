import {computed, onMounted, reactive} from 'vue'
import {designComponent} from "../../use/designComponent";
import './carousel.scss'
import {useSlots} from "../../use/useSlots";
import {useProps} from "../../use/useProps";
import {useStyles} from "../../use/useStyles";
import {unit} from "plain-utils/string/unit";
import Item from './carousel-item'
import {useCollect} from "../../use/useCollect";
import {useModel} from "../../use/useModel";
import {useRefs} from "../../use/useRefs";

export const Carousel = designComponent({
    name: 'pl-carousel',
    props: {
        modelValue: {type: [String, Number]},
        height: {type: [Number, String], default: 180},
    },
    emits: {
        updateModelValue: (val: string | number | undefined | null) => true,
    },
    setup({props, event: {emit}}) {

        const items = CarouselCollector.parent()
        const {slots} = useSlots([
            'cover',
        ], true)
        const {propsState} = useProps(props, {
            height: useProps.NUMBER,
        })
        const {refs} = useRefs({
            el: HTMLDivElement
        })
        const state = reactive({
            width: 0,
        })

        const model = useModel(() => props.modelValue, emit.updateModelValue)
        const vals = computed(() => items.map(item => String(item.value.value)!))
        const activeVal = computed(() => {
            if (vals.value.length === 0) {
                return null
            }
            if (model.value != null) {
                return String(model.value)
            } else {
                return vals.value[0]
            }
        })
        const activeIndex = computed(() => {
            if (!activeVal.value) {
                return 0
            }
            return vals.value.indexOf(activeVal.value)
        })

        const sortVals = computed(() => {
            const valArray = vals.value
            let prev = valArray.slice(0, activeIndex.value)
            let next = valArray.slice(activeIndex.value + 1)

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

        const utils = {
            getLeft: (val: any) => {
                if (!state.width) {
                    return null
                }
                let duration = sortVals.value.indexOf(val) - sortVals.value.indexOf(activeVal.value!)
                return {
                    left: duration * state.width,
                    zIndex: sortVals.value.length - Math.abs(duration),
                }
            }
        }

        const methods = {
            prev: () => {
                model.value = sortVals.value[sortVals.value.indexOf(activeVal.value) - 1]!
            },
            next: () => {
                model.value = sortVals.value[sortVals.value.indexOf(activeVal.value) + 1]!
            },
        }

        onMounted(() => {
            state.width = refs.el.offsetWidth
        })

        return {
            refer: {
                utils,
            },
            render: () => (
                <div class="pl-carousel" style={styles.value} ref="el">
                    {slots.default()}
                    {slots.cover.isExist() && <div class="pl-carousel-cover">
                        {slots.cover()}
                    </div>}

                    <div class="pl-carousel-operator">
                        <div class="pl-carousel-operator-btn pl-carousel-operator-prev" onClick={methods.prev}>
                            <pl-icon icon="el-icon-arrow-left"/>
                        </div>
                        <div class="pl-carousel-operator-btn pl-carousel-operator-next" onClick={methods.next}>
                            <pl-icon icon="el-icon-arrow-right"/>
                        </div>
                    </div>

                    <div class="pl-carousel-indicator">
                        {items.map((item, index) => (
                            <div class={[
                                'pl-carousel-indicator-item',
                                {
                                    'pl-carousel-indicator-item-active': item.value.value === activeVal.value
                                }
                            ]} key={index}/>
                        ))}
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