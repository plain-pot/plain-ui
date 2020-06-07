import {computed, defineComponent, provide} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {useCollectParent} from "@/use/useCollect";
import {SELECT_PANEL_PROVIDER} from "@/packages/select/select-utils";

export const I_AM_SELECT_PANEL = '@@I_AM_SELECT_PANEL'

export default defineComponent({
    name: 'pl-select-panel',
    props: {
        showDebug: {type: Boolean}
    },
    setup(props) {

        const {slots} = useSlots()
        provide(I_AM_SELECT_PANEL, true)

        const items = useCollectParent({sort: true, provideString: SELECT_PANEL_PROVIDER}) as any

        const formatData = computed(() => {
            const array: any[] = []
            utils.iterateAll(items.value, ({item, index}) => array.push(item))
            return array
        })

        const utils = {
            iterateAll: (array, fn) => {
                (array || []).forEach((item, index) => {
                    if (!item.group) {
                        fn({item, index})
                    } else {
                        if (!!item.items.value && item.items.value.length > 0) {
                            utils.iterateAll(item.items.value, fn)
                        }
                    }
                })
            }
        }

        return () => (
            <div class="pl-select-panel">
                {slots.default()}

                {
                    !!props.showDebug && (
                        <div class="pl-select-panel-debug">
                            {formatData.value.map((item, index) => (
                                <div>{index}-{item.label}-{item.val}</div>
                            ))}
                        </div>
                    )
                }
            </div>
        )
    },
})