import {defineComponent, provide} from "@vue/composition-api";
import {StyleProps, useStyle} from "@/use/useStyle";
import {EditProps, useEdit} from "@/use/useEdit";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {FormatPropsType, useProps} from "@/use/useProps";
import {useModel} from "@/use/useModel";
import {useSlots} from "@/use/useSlots";

export const PLAIN_RADIO_GROUP_PROVIDER = '@@PLAIN_RADIO_GROUP_PROVIDER'

export default defineComponent({
    name: 'pl-radio-group',
    props: {
        ...EditProps,
        ...StyleProps,

        value: {},
        itemWidth: {type: [String, Number]},                       // 每一个单选框的宽度
    },
    setup(props, context) {

        const {slots} = useSlots()

        useEdit()
        useStyle()

        /*---------------------------------------emit-------------------------------------------*/
        const {emit} = useEvent({
            input: EmitFunc,
        })

        /*---------------------------------------state-------------------------------------------*/

        const model = useModel(() => props.value, emit.input)

        const propsState = useProps(props, {
            itemWidth: FormatPropsType.number,
        })

        provide(PLAIN_RADIO_GROUP_PROVIDER, {
            propsState,

            onClickRadio: (val: any) => {
                model.value = val
            },
            /**
             * 判断 checkbox是否选中
             * @author  韦胜健
             * @date    2020/3/4 18:50
             */
            isChecked(val: any) {
                return model.value === val
            },
        })

        return () => (
            <div class={'pl-radio-group'}>
                {slots.default()}
            </div>
        )
    },
})