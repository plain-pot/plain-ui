import {computed, defineComponent, provide} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {useRefs} from "@/use/useRefs";
import {$plain} from "@/packages/base";
import {PlainScroll} from "@/packages/scroll/scroll";

export const enum TabHeaderType {
    text = 'text',
    card = 'card',
    fillet = 'fillet',
    verticalText = 'vertical-text'
}

export const enum TabHeaderPosition {
    top = 'top',
    bottom = 'bottom',
    left = 'left',
    right = 'right'
}

export const TAB_HEADER_PROVIDER = '@@TAB_HEADER_PROVIDER'

export default defineComponent({
    name: 'pl-tab-header',
    props: {
        type: {type: String, default: TabHeaderType.text},
        position: {type: String, default: TabHeaderPosition.top},
        width: {type: Number, default: '120'},
    },
    setup(props) {

        const refs = useRefs({
            scroll: {} as PlainScroll,
        })

        const {slots} = useSlots()

        const type = computed(() => {
            return props.position === TabHeaderPosition.left || props.position === TabHeaderPosition.right ? TabHeaderType.verticalText : props.type
        })

        const classes = computed(() => [
            'pl-tab-header',
            `pl-tab-header-type-${type.value}`,
            `pl-tab-header-position-${props.position}`,
        ])

        const styles = computed(() => {
            if (type.value !== TabHeaderType.verticalText) return {}
            return {
                width: $plain.utils.suffixPx(props.width)
            }
        })

        const handler = {
            mousewheel: e => {
                if (type.value !== TabHeaderType.verticalText) {
                    e.stopPropagation()
                    e.preventDefault()
                    const delta = e.deltaX || e.deltaY
                    let oldLeft = refs.scroll.state.wrapperScrollLeft
                    refs.scroll.methods.scroll({x: delta + oldLeft})
                }
            }
        }

        provide(TAB_HEADER_PROVIDER, {
            props,
            type,
        })

        const scrollBinding = computed(() => {
            return type.value === TabHeaderType.verticalText ?
                {
                    scrollbarSize: 4,

                    scrollX: false,
                    scrollY: true,
                } :
                {
                    scrollbarSize: 4,

                    scrollX: true,
                    scrollY: false,
                    fitHostHeight: true,
                }
        })

        return () => (
            <div class={classes.value} style={styles.value}>
                <pl-scroll {...{props: scrollBinding.value}} ref={"scroll"}>
                    <div class="pl-tab-header-item-list" onMousewheel={handler.mousewheel}>
                        {slots.default()}
                    </div>
                </pl-scroll>
            </div>
        )
    },
})