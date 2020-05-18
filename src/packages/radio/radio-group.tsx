import {defineComponent, provide} from "@vue/composition-api";
import {StyleProps, useStyle} from "@/use/useStyle";
import {EditProps, useEdit} from "@/use/useEdit";
import {EmitFunc, useListener} from "@/use/useEvent";
import {FormatPropsType, useProps} from "@/use/useProps";
import {useModel} from "@/use/useModel";

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

        useEdit()
        useStyle()

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