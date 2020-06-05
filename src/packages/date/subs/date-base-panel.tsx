import {defineComponent} from "@vue/composition-api";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {SlotFunc, useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-date-base-panel',
    props: {
        direction: {type: String},                          // 面板切换动画所需要的属性
    },
    setup(props) {

        const {slots} = useSlots({
            left: SlotFunc,
            center: SlotFunc,
            right: SlotFunc,
            content: SlotFunc,
        })

        const {emit} = useEvent({
            mousedownPanel: EmitFunc,
        })

        return () => (
            <div class="pl-date-base-panel" direction={props.direction} onMousedown={emit.mousedownPanel}>
                <pl-date-base-panel-header>
                    <template slot="left">{slots.left()}</template>
                    <template slot="center">{slots.center()}</template>
                    <template slot="right">{slots.right()}</template>
                </pl-date-base-panel-header>
                <div class="pl-date-base-panel-body">
                    {slots.content()}
                </div>
            </div>
        )
    },
})