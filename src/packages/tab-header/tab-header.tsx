import {computed, defineComponent} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";

const enum TabHeaderType {
    text = 'text',
    card = 'card',
}

const enum TabHeaderPosition {
    top = 'top',
    bottom = 'bottom',
    left = 'left',
    right = 'right'
}

export default defineComponent({
    name: 'pl-tab-header',
    props: {
        type: {type: String, default: TabHeaderType.text},
        position: {type: String, default: TabHeaderPosition.top},
    },
    setup(props) {

        const {slots} = useSlots()

        const classes = computed(() => [
            'pl-tab-header',
            `pl-tab-header-type-${props.type}`,
            `pl-tab-header-position-${props.position}`,
        ])

        return () => (
            <div class={classes.value}>
                <pl-scroll scrollX={true} scrollY={false} fitHostHeight>
                    <div class="pl-tab-header-item-list">
                        {slots.default()}
                    </div>
                </pl-scroll>
            </div>
        )
    },
})