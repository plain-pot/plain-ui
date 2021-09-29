import {designComponent, PropType, reactive, useModel, watch} from "plain-ui-composition";

import PlSelect from "../PlSelect";
import {iOvData} from "../useOv/useOv.utils";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps} from "../../use/useStyle";
import useOv from "../useOv";
import PlSelectOption from "../PlSelectOption";

export const PlOv = designComponent({
    props: {
        ...EditProps,
        ...StyleProps,
        multiple: {type: Boolean},

        modelValue: {type: [String, Number, Array] as PropType<string | number | (string | number)[]>},
        ov: {type: String},
    },
    emits: {
        onUpdateModelValue: (val?: string | number | (string | number)[]) => true,
    },
    setup({props, event: {emit}}) {

        const {$ov} = useOv()

        const {editComputed, editState} = useEdit()

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

        const state = reactive({
            ovList: [] as iOvData[]
        })

        watch(() => props.ov, async type => {
            if (!type) {
                return state.ovList = []
            }
            editState.loading = true
            state.ovList = await $ov.getOvByType(type)
            editState.loading = false
        }, {immediate: true})

        return () => (
            <PlSelect
                modelValue={editComputed.value.loading ? (props.multiple ? undefined : '加载中...') : model.value}
                onUpdateModelValue={val => model.value = val as string}
                multiple={props.multiple}
            >
                {state.ovList.map((ov, index) => (
                    <PlSelectOption label={ov.name} val={ov.code} key={index}/>
                ))}
            </PlSelect>
        )
    },
})

export default PlOv
