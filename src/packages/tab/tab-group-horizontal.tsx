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
                <div class={'pl-tab-group-horizontal-head'}>
                    <pl-scroll scrollX scrollY={false} fitHostHeight>
                        <ul class={"pl-tab-group-horizontal-head-list"}>
                            {group.items.value.map((item, index) => (
                                <li class={[
                                    'pl-tab-group-horizontal-head-item'
                                ]}>
                                    {item.props.title}
                                </li>
                            ))}
                        </ul>
                    </pl-scroll>
                </div>
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