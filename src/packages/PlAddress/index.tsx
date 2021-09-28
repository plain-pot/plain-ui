import {designComponent, reactive, useModel, watch, watchEffect} from "plain-design-composition";

import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps} from "../../use/useStyle";
import useAddress from "../useAddress";
import {iAddressData} from "../useAddress/useAddress.utils";
import PlSelect from "../PlSelect";
import PlSelectOption from "../PlSelectOption";


/**
 * 判断在这一次js执行栈运行过程中，是否为O2Address触发的change动作
 * @author  韦胜健
 * @date    2021/7/13 16:35
 */
let watchParentChange = false

export const PlAddress = designComponent({
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {type: String},                          // 绑定值，如果bindId为true，那么就是绑定id；
        parentValue: {type: String},                    // 父绑定值，如果bindId为true，那么就是绑定id；

        province: {type: Boolean, default: false},       // 是否为选择省份
        city: {type: Boolean, default: false},          // 是否为选择城市
        district: {type: Boolean, default: false},      // 是否为选择区县
    },
    emits: {
        onUpdateModelValue: (val?: string | number) => true,
    },
    setup({props, event: {emit}}) {

        const {$address} = useAddress()

        const {editState, editComputed} = useEdit({
            adjust: val => {
                if (!props.province && !props.parentValue) {
                    val.disabled = true
                }
            }
        })
        /*值双向绑定值*/
        const valueModel = useModel(() => props.modelValue, emit.onUpdateModelValue)

        const freezeState = {
            // 如果parentValue发生变化，则重新加载options数据
            parentValue: undefined as undefined | string | number,
        }

        const state = reactive({
            options: [] as iAddressData[],
        })

        watchEffect(async () => {
            const {parentValue} = props
            /*如果父值，以及是否为国家都没有变化，则证明数据已经加载过，无需再加载*/
            if (parentValue == freezeState.parentValue && !props.province) {return}
            freezeState.parentValue = parentValue
            state.options = []
            editState.loading = true

            if (props.province) {
                state.options = await $address.getAddressByParentCode("0")
            } else {
                if (!!parentValue) {
                    state.options = await $address.getAddressByParentCode(parentValue)
                }
            }
            editState.loading = false
        }, {flush: 'post'})

        const handler = {
            /**
             * 当O2Select触发change之后，根据change之后的val更新nameModel
             * @author  韦胜健
             * @date    2021/7/13 16:30
             */
            onSelectChange: (val: string | undefined) => {
                valueModel.value = val

                /**
                 * 某个O2Address触发change的时候，告诉其他的O2Address，检查一下parentValue有没有变化，变化了就重置（清空）绑定的name以及value
                 * @author  韦胜健
                 * @date    2021/7/13 16:31
                 */
                ;(watchParentChange = true) && (setTimeout(() => watchParentChange = false))
            }
        }

        /**
         * - 监听parentValue的变化，如果新值和旧值不相同（一般情况下肯定是不相同的，不然不会触发watch的动作）
         * - 则清空绑定的name以及value
         * - watchParentChange主要是用来判断，这个parentValue的变化是 Address change导致的，还是用户手动修改数据导致的，
         * 因为只有Address change的情况下，watchParentChange才是true
         * @author  韦胜健
         * @date    2021/7/13 16:32
         */
        watch(() => props.parentValue, (newVal, oldVal) => {
            if (newVal != oldVal && watchParentChange) {
                valueModel.value = undefined
            }
        })

        return () => (
            <PlSelect
                modelValue={editComputed.value.loading ? '加载中...' : valueModel.value}
                onUpdateModelValue={val => handler.onSelectChange(val as string)}>
                {state.options.map((addr) => (
                    <PlSelectOption label={addr.name} val={addr.code} key={addr.code}/>
                ))}
            </PlSelect>
        )
    },
})

export default PlAddress
