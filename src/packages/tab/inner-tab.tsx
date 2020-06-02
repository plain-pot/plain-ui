import {defineComponent, inject, reactive, watch} from "@vue/composition-api";
import {$plain} from "@/packages/base";
import {TAB_GROUP_PROVIDER} from "@/packages/tab/tab-group";

export default defineComponent({
    name: 'pl-inner-tab',
    props: {
        item: {type: Object},
        index: {type: Number},
    },
    setup(props) {

        const state = reactive({
            show: false,
            init: false,
        })

        const methods = {
            show: async () => {
                if (state.show) return
                else {
                    if (!state.init) {
                        state.init = true
                        await $plain.nextTick()
                    }
                    state.show = true
                }
            },
            hide: () => {
                if (!state.show) return
                else {
                    state.show = false
                }
            }
        }

        const tabGroup = inject(TAB_GROUP_PROVIDER) as any

        watch(() => tabGroup.model.value, (val) => {
            if (val === props.item!.targetVal.value) {
                methods.show()
            } else {
                methods.hide()
            }
        })

        return () => {
            return (
                <transition name="pl-transition-tab">
                    <div class="pl-inner-tab" {...{directives: [{name: 'show', value: state.show}]}}>
                        {!!state.init && props.item!.slots.default()}
                    </div>
                </transition>
            )
        }
    },
})