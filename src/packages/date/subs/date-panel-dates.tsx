import {computed, defineComponent} from "@vue/composition-api";
import {DatePublicProps, DateView} from "@/packages/date/date-utils";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useDate} from "@/packages/date/useDate";
import {PlainDate} from "@/util/PlainDate";
import {$plain} from "@/packages/base";

export default defineComponent({
    name: 'pl-date-panel-dates',
    props: {
        ...DatePublicProps,
    },
    setup(props) {

        const {emit} = useEvent({
            input: EmitFunc,
            mousedownPanel: EmitFunc,
        })

        const {
            model,
            displayFormat,
            valueFormat,
        }
            =
            useDate({
                props,
                injectView: DateView.date,
                getProvideData: () => ({} as any),
                getChildActive(ipd: PlainDate | number, type: DateView): boolean {
                    const {value} = formatData.value
                    if (type === DateView.year) {
                        return !!$plain.utils.findOne(value, item => item.Y === ipd)
                    } else if (type === DateView.month) {
                        return !!$plain.utils.findOne(value, item => item.YM === (ipd as PlainDate).YM)
                    } else if (type === DateView.date) {
                        return !!$plain.utils.findOne(value, item => item.YMD === (ipd as PlainDate).YMD)
                    }
                    return false
                },
            })

        const formatData = computed(() => {
            let value = model.value as string[] | undefined
            let {max, min} = props
            value = value || []
            return {
                value: value.map(item => new PlainDate(item, displayFormat.value, valueFormat.value)),
                max: new PlainDate(max, displayFormat.value, valueFormat.value),
                min: new PlainDate(min, displayFormat.value, valueFormat.value),
            }
        })

        const datePanelBinding = computed(() => {
            return {
                props: {
                    max: props.max,
                    min: props.min,
                },
                on: {
                    'click-item': handler.onClickItem
                },
            }
        })

        const handler = {
            onClickItem(ipd: PlainDate) {
                const {value} = formatData.value
                const ret = $plain.utils.findOne(value, item => item.YMD === ipd.YMD, true) as { item: PlainDate, index: number }
                if (!!ret) {
                    value.splice(ret.index, 1)
                } else {
                    value.push(ipd)
                }
                model.value = value.map(item => item.valueString)
            },
        }

        return () => (
            <pl-date-base-panel-date {...datePanelBinding.value} {...{on: {'mousedown-panel': emit.mousedownPanel}}}/>
        )
    },
})