import {designComponent} from "../../../use/designComponent";
import {DatePublicProps} from "../date.utils";
import {useDate, UseDateJudgementView} from "../useDate";
import {computed} from 'vue';
import {PlainDate, PlainDateType} from "../../../utils/PlainDate";
import {findOne} from "plain-utils/object/findOne";

export default designComponent({
    name: 'pl-date-panel-dates',
    props: {
        ...DatePublicProps,
        modelValue: {type: Array},
    },
    emits: {
        onUpdateModelValue: (val?: string[]) => true,
    },
    setup({props, event: {emit}}) {

        const {
            model,
            displayFormat,
            valueFormat,
        } = useDate({
            props: props as any,
            emit: emit as any,
            jdView: UseDateJudgementView.YMD,
            judgementForChild: {
                active: (ipd, view) => {
                    const {value} = formatData.value
                    return value.length > 0 && !!value.find(vpd => vpd[view] === ipd[view])
                },
            },
        })

        const valueModel = model as { value?: string[] }
        const formatData = computed(() => {
            let value = model.value as string[] | undefined
            value = value || []
            return {
                value: value.map(item => new PlainDate(item, displayFormat, valueFormat)),
            }
        })

        const handler = {
            onClickItem(ipd: PlainDateType) {
                const {value} = formatData.value
                const ret = findOne(value, item => item.YMD === ipd.YMD, true) as { item: PlainDateType, index: number } | { item: null }
                if (!!ret.item) {
                    value.splice(ret.index, 1)
                } else {
                    value.push(ipd)
                }
                valueModel.value = value.map(item => item.valueString!)
            },
        }

        return {
            render: () => (<pl-date-base-panel-date onClickItem={handler.onClickItem}/>)
        }
    },
})