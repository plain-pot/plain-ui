import {computed, defineComponent, inject} from "@vue/composition-api";
import {TAB_GROUP_PROVIDER} from "@/packages/tab/tab-group";

export default defineComponent({
    name: 'pl-tab-group-horizontal',
    setup() {

        const group = inject(TAB_GROUP_PROVIDER) as any

        const classes = computed(() => [
            'pl-tab-group-horizontal',
            `pl-tab-group-horizontal-style-${group.props.headType}`,
            `pl-tab-group-horizontal-position-${group.props.headPosition}`
        ])

        return () => {

            const head = (
                <pl-tab-header>
                    {group.items.value.map((item, index) => (
                        <pl-tab-header-item key={index} active={item.targetVal.value === group.model.value} onClick={() => group.handler.clickHeadItem(item, index)}>
                            {item.props.title}
                        </pl-tab-header-item>
                    ))}
                </pl-tab-header>
            )

            return (
                <div class={classes.value}>
                    {head}
                    <div>
                        pl-tab-group-horizontal
                    </div>
                </div>
            )
        }
    },
})