import {defineComponent, provide} from "@vue/composition-api";
import {EditProps, EmitFunc, FormatPropsType, StyleProps, useEdit, useListener, useModel, useProps, useStyle} from "@/util/use";

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

        useEdit(props)
        useStyle(props)

        /*---------------------------------------emit-------------------------------------------*/
        const {emit} = useListener(context, {
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
                {!!context.slots.default && context.slots.default()}
            </div>
        )
    },
})