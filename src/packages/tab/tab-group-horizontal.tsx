import {computed, defineComponent, inject} from "@vue/composition-api";
import {TAB_GROUP_PROVIDER} from "@/packages/tab/tab-group";

export default defineComponent({
    name: 'pl-tab-group-horizontal',
    setup() {

        const group = inject(TAB_GROUP_PROVIDER) as any

        const classes = computed(() => [
            'pl-tab-group-horizontal',
            `pl-tab-group-horizontal-position-${group.props.headPosition}`
        ])

        return () => {
            return (
                <div class={classes.value}>
                    <pl-tab-header type={group.props.headType} position={group.props.headPosition}>
                        {group.items.value.map((item, index) => (
                            <pl-tab-header-item key={index} active={item.targetVal.value === group.model.value} onClick={() => group.handler.clickHeadItem(item, index)}>
                                <span>{item.props.title}</span>
                                {!!group.props.closeIcon && <pl-icon icon="el-icon-close" onClick={() => group.handler.clickCloseIcon(item, index)}/>}
                            </pl-tab-header-item>
                        ))}
                    </pl-tab-header>

                    <div class="pl-tab-group-inner-tab-list">
                        {group.items.value.map((item, index) => (
                            <pl-inner-tab item={item} index={index}/>
                        ))}
                    </div>
                </div>
            )
        }
    },
})