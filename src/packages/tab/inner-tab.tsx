import {designComponent} from "../../use/designComponent";
import {PropType, reactive, nextTick, watch, Transition} from 'vue';
import {PlTabComponent} from "./tab";

export const PlInnerTab = designComponent({
    props: {
        item: {type: Object as PropType<PlTabComponent>, required: true},
        active: {type: Boolean},
    },
    setup({props}) {

        const state = reactive({
            show: false,
            init: props.item.props.init,
        })

        const methods = {
            show: async () => {
                if (state.show) return
                else {
                    if (!state.init) {
                        state.init = true
                        await nextTick()
                    }
                    state.show = true
                }
            },
            hide: async () => {
                if (!state.show) return
                else {
                    state.show = false
                    if (props.item!.props.destroyOnHide) {
                        await nextTick()
                        state.init = false
                    }
                }
            }
        }

        watch(() => props.active, async (val) => {val ? await methods.show() : await methods.hide()}, {immediate: true})

        return {
            render: () => (
                <Transition name="pl-transition-tab">
                    <div class="pl-inner-tab" v-show={props.active}>
                        {!!state.init && props.item.slots.default()}
                    </div>
                </Transition>
            )
        }
    },
})