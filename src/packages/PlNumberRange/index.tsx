import {computed, designComponent, useModel} from "plain-design-composition";

import PlInputGroup from "../PlInputGroup";
import PlDate from "../PlDate";
import PlInput from "../PlInput";
import PlNumber from "../PlNumber";

export const PlNumberRange = designComponent({
    name: 'pl-number-range',
    props: {
        start: {type: [String, Number]},
        end: {type: [String, Number]},
    },
    emits: {
        onUpdateStart: (val?: string | number) => true,
        onUpdateEnd: (val?: string | number) => true,
        onBlur: () => true,
        onEnter: () => true,
        onClear: () => true,
    },
    setup({props, event: {emit}}) {

        const startModel = useModel(() => props.start, emit.onUpdateStart)
        const endModel = useModel(() => props.end, emit.onUpdateEnd)

        const placeValue = computed(() => {
            let start = startModel.value == null ? '' : String(startModel.value).trim()
            let end = endModel.value == null ? '' : String(endModel.value).trim()
            return start + end
        })

        const checkRange = () => {
            let start = startModel.value
            let end = endModel.value
            let startNum = Number(start)
            let endNum = Number(end)
            if (start == null || end == null || isNaN(startNum) || isNaN(endNum)) {
                return
            }
            if (startNum > endNum) {
                [startNum, endNum] = [endNum, startNum]
                startModel.value = startNum
                endModel.value = endNum
            }
        }

        const handler = {
            onBlur: (): void => {
                checkRange()
                emit.onBlur()
            },
            onEnter: () => {
                checkRange()
                emit.onEnter()
            },
            onClear: () => {
                startModel.value = undefined
                endModel.value = undefined
                emit.onClear()
            },
        }

        return () => (
            <PlInputGroup block>
                <PlNumber v-model={startModel.value} onBlur={handler.onBlur} hideButton width="80" align="center" fillGroup onEnter={handler.onEnter}/>
                <PlInput modelValue="~" readonly align="center" width={36}/>
                <PlNumber v-model={endModel.value} onBlur={handler.onBlur} hideButton width="80" align="center" fillGroup onEnter={handler.onEnter}/>
                <PlInput
                    customReadonly
                    class="pl-filter-ele"
                    align="center"
                    suffixIcon="el-icon-s-fold"
                    placeValue={placeValue.value}
                    clearHandler={handler.onClear}
                    clearIcon
                    nativeAttrs={{style: {padding: 0, width: '36px'},}}/>
            </PlInputGroup>
        )
    },
})

export default PlNumberRange
