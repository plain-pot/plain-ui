import {designComponent} from "../../use/designComponent";
import {StyleProps, useStyle} from "../../use/useStyle";
import {useSlots} from "../../use/useSlots";
import {getCurrentInstance, DefineComponent, reactive,Teleport} from 'vue';
import {RootController} from "./index";

export default designComponent({
    name: 'pl-root',
    props: {
        ...StyleProps,
    },
    setup() {
        const ctx = getCurrentInstance()!
        useStyle()
        const {slots} = useSlots()

        const state = reactive({
            controllers: [] as DefineComponent[],
        })
        const methods = {
            getController: async () => {
                return

            }
        }

        const refer = {
            rootRef: () => ctx.proxy!.$root!,
            getService: () => {
                return {}
            },
        }
        RootController.initRoot(refer)

        return {
            refer,
            render: () => [
                slots.default(),
                <div class="pl-root-service-container">
                    pl-root-service-container
                </div>
            ]
        }
    },
})