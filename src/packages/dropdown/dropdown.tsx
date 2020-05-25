import {defineComponent, reactive} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {useScopedSlots} from "@/use/useScopedSlots";
import {EmitFunc, useEvent} from "@/use/useEvent";

export default defineComponent({
    name: 'pl-dropdown',
    props: {
        value: {type: Boolean},                                         // model绑定是否打开下拉列表
        trigger: {type: String, default: 'click'},                      // click, focus, hover, manual
        width: {type: [String, Number]},                                // popper 宽度
        height: {type: [String, Number]},                               // popper高度

        hoverOpenDelay: {type: [Number, String], default: 0},           // hover触发条件下，打开延迟时间
        hoverCloseDelay: {type: [Number, String], default: 200},        // hover触发条件下，关闭延迟时间
    },
    setup(props, context) {

        const {$slots} = useSlots()
        const {$scopedSlots} = useScopedSlots()

        const {emit} = useEvent({
            input: EmitFunc,
            enterPopper: EmitFunc,
            leavePopper: EmitFunc,
            clickWindow: EmitFunc,
            clickPopper: EmitFunc,
            clickReference: EmitFunc,
            clickBody: EmitFunc,
        })

        /*---------------------------------------state-------------------------------------------*/

        const state = reactive({
            val: props.value,
            isShow: false,
            isOpen: false,
        })



        /*---------------------------------------handler-------------------------------------------*/




        return () => {
            if (!!$slots.default && !!$slots.default[0]) return $slots.default[0]
            else if (!!$scopedSlots.default) return $scopedSlots.default({show: state.isShow, open: state.isOpen})
            return null
        }
    },
})