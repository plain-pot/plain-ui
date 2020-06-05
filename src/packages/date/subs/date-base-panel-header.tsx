import {defineComponent} from "@vue/composition-api";
import {SlotFunc, useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-date-base-panel-header',
    setup() {

        const {slots} = useSlots({
            left: SlotFunc,
            center: SlotFunc,
            right: SlotFunc,
        })

        return () => (
            <div class="pl-date-base-panel-header">
                <div>
                    {slots.left()}
                </div>
                <div>
                    {slots.center()}
                </div>
                <div>
                    {slots.right()}
                </div>
            </div>
        )
    },
})