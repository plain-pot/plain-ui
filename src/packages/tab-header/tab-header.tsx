import {computed, defineComponent, provide} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {CompRef, useRefs} from "@/use/useRefs";

const enum TabHeaderType {
    text = 'text',
    card = 'card',
    fillet = 'fillet',
}

const enum TabHeaderPosition {
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
    },
    setup(props) {

        const refs = useRefs({
            scroll: CompRef,
        })

        const {slots} = useSlots()

        const classes = computed(() => [
            'pl-tab-header',
            `pl-tab-header-type-${props.type}`,
            `pl-tab-header-position-${props.position}`,
        ])

        const handler = {
            mousewheel: e => {
                e.stopPropagation()
                e.preventDefault()
                const delta = e.deltaX || e.deltaY
                let oldLeft = refs.scroll.state.wrapperScrollLeft
                refs.scroll.methods.scroll({x: delta + oldLeft})
            }
        }

        provide(TAB_HEADER_PROVIDER, {
            props,
        })

        return () => (
            <div class={classes.value}>
                <pl-scroll scrollX={true} scrollY={false} fitHostHeight scrollbarSize={6} ref={"scroll"}>
                    <div class="pl-tab-header-item-list" onMousewheel={handler.mousewheel}>
                        {slots.default()}
                    </div>
                </pl-scroll>
            </div>
        )
    },
})