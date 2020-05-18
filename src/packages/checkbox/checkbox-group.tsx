import {computed, defineComponent, provide, reactive, Ref} from "@vue/composition-api";

import {PLAIN_CHECK_STATUS} from "@/util/constant";
import {$plain} from "@/packages/base";
import {StyleProps, useStyle} from "@/use/useStyle";
import {EditProps, useEdit} from "@/use/useEdit";
import {EmitFunc, useListener} from "@/use/useEvent";
import {FormatPropsType, useProps} from "@/use/useProps";
import {useModel} from "@/use/useModel";

export const PLAIN_CHECKBOX_PROVIDER = '@@PLAIN_CHECKBOX_PROVIDER'

export default defineComponent({
    name: 'pl-checkbox-group',
    props: {
        ...EditProps,
        ...StyleProps,

        value: {type: Array},

        min: {type: Number},                                        // 最大勾选个数
        max: {type: Number},                                        // 最小勾选个数
        itemWidth: {type: [String, Number]},                       // 文本宽度
    },
    setup(props, context) {

        /*---------------------------------------emitter-------------------------------------------*/
        const {emit} = useListener(context, {
            input: EmitFunc,
        })

        /*---------------------------------------state-------------------------------------------*/

        const {editComputed} = useEdit(props)
        useStyle(props)

        const propsState = useProps(props, {
            min: FormatPropsType.number,
            max: FormatPropsType.number,
            itemWidth: FormatPropsType.number,
        })

        const model = useModel(() => (props.value), emit.input)

        const state = reactive({
            itemValList: [] as any[],
        })

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            isChecked: (val) => {
                const vals = model.value || []
                return vals.indexOf(val) > -1
            },
            checkTypeOfValue: () => {
                if (!!model.value && !Array.isArray(model.value)) {
                    console.error('pl-checkbox: typeof value must be array')
                }
            },
        }

        utils.checkTypeOfValue()

        /*---------------------------------------computer-------------------------------------------*/

        const checkStatus: Ref<PLAIN_CHECK_STATUS> = computed(() => {
            if (!model.value || model.value.length === 0) return PLAIN_CHECK_STATUS.uncheck
            if (state.itemValList.every(val => utils.isChecked(val))) return PLAIN_CHECK_STATUS.check
            return PLAIN_CHECK_STATUS.minus
        })

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            /**
             * 处理选中 checkbox 的动作
             * @author  韦胜健
             * @date    2020/3/4 18:50
             */
            onClickCheckbox: (val) => {
                if (!editComputed.value.editable) return
                let value = model.value || []

                if (utils.isChecked(val)) {
                    // 删除
                    if (!!propsState.min && value.length <= propsState.min) {
                        return $plain.$message.warn(`最少选择 ${propsState.min} 个选项！`)
                    }
                    model.value = value.filter(item => item !== val)
                } else {
                    // 添加
                    if (!!propsState.max && value.length >= propsState.max) {
                        return $plain.$message.warn(`最多选择 ${propsState.max} 个选项！`)
                    }
                    value.push(val)
                    model.value = [...value]
                }
            },
            /**
             * 点击全选按钮
             * @author  韦胜健
             * @date    2020/3/4 19:11
             */
            onClickCheckBoxForAll: () => {
                if (!editComputed.value.editable) return
                switch (checkStatus.value) {
                    case PLAIN_CHECK_STATUS.check:
                        model.value = []
                        break
                    case PLAIN_CHECK_STATUS.uncheck:
                    case PLAIN_CHECK_STATUS.minus:
                        model.value = Array.from(new Set((!!propsState.max ? state.itemValList.slice(0, propsState.max) : [...state.itemValList])))
                        break
                }
            },
            addItem: (val) => {
                state.itemValList.push(val)
            },
            removeItem: (val) => {
                const index = state.itemValList.indexOf(val)
                index > -1 && state.itemValList.splice(index, 1)
            },
        }

        provide(PLAIN_CHECKBOX_PROVIDER, {
            propsState,
            utils,
            handler,
        })


        return () => (
            <div class={'pl-checkbox-group'}>
                <pl-checkbox-indeterminate checkboxProps={{label: '全选', ignore: true, value: checkStatus.value === PLAIN_CHECK_STATUS.check}}
                                           status={checkStatus.value}
                                           disabled={editComputed.value.disabled}
                                           onClick={handler.onClickCheckBoxForAll}/>
                {!!context.slots.default && context.slots.default()}
            </div>
        )
    },
})