import {designComponent} from "../../../use/designComponent";
import {TimePublicProps} from './time-panel.utils';
import {computed} from 'vue';
import {PlainDate} from "../../../utils/PlainDate";
import './time-base-panel.scss'

export enum TimePanelLayout {
    h = 'hour',
    m = 'minute',
    s = 'second',
}

export default designComponent({
    name: 'pl-time-base-panel',
    props: {
        modelValue: {type: String},
        disableChangeOnScroll: {type: Boolean},// 是否禁用在滚动的时候触发更新值动作
        ...TimePublicProps,
    },
    emits: {
        updateModelValue: (val: string | null) => true,
    },
    setup({props, event}) {

        const formatData = computed(() => {
            return {
                value: new PlainDate(props.modelValue, props.displayFormat, props.valueFormat),
                max: new PlainDate(props.max, props.displayFormat, props.valueFormat),
                min: new PlainDate(props.min, props.displayFormat, props.valueFormat),
            }
        })

        const maxmin = computed(() => {

            const max = {
                hour: null as null | number,
                minute: null as null | number,
                second: null as null | number,
            }
            const min = {
                hour: null as null | number,
                minute: null as null | number,
                second: null as null | number,
            }

            const {max: maxpd, min: minpd, value: vpd} = formatData.value

            if (!!maxpd.hour) {
                max.hour = maxpd.hour
                if (vpd.hour == null) {
                    // 有最大值，但是没有选择【时】的情况下，分以及秒不能选择任意选项
                    max.minute = -Infinity
                    max.second = -Infinity
                } else {
                    if (vpd.hour < max.hour) {
                        // 有最大值，但是【时】没有达到最大值，此时分以及秒可以任意选择
                        max.minute = null
                        max.second = null
                    } else {
                        max.minute = maxpd.minute
                        if (vpd.minute == null) {
                            max.second = -Infinity
                        } else {
                            if (vpd.minute < max.minute!) {
                                max.second = null
                            } else {
                                max.second = maxpd.second
                            }
                        }
                    }
                }
            }

            if (!!minpd.hour) {
                min.hour = minpd.hour
                if (vpd.hour == null) {
                    // 有最小值，但是没有选择【时】的情况下，分以及秒不能选择任意选项
                    min.minute = Infinity
                    min.second = Infinity
                } else {
                    if (vpd.hour > min.hour) {
                        // 有最小值，但是【时】没有达到最小值，此时分以及秒可以任意选择
                        min.minute = null
                        min.second = null
                    } else {
                        min.minute = minpd.minute
                        if (vpd.minute == null) {
                            min.second = Infinity
                        } else {
                            if (vpd.minute > min.minute!) {
                                min.second = null
                            } else {
                                min.second = minpd.second
                            }
                        }
                    }
                }
            }

            return {
                max, min,
            }
        })

        const checkDisabled = computed(() => !props.checkDisabled ? null : (num: number, layout: TimePanelLayout) => props.checkDisabled!(num, layout, formatData.value.value))

        const custom = computed(() => !props.custom ? null : (layout: TimePanelLayout) => props.custom!(layout, formatData.value.value))

        const handler = {
            columnChange: (value: number, type: string) => {

                const {value: vpd, max: maxpd, min: minpd} = formatData.value

                switch (type) {
                    case 'h':
                        vpd.setHour(value)
                        break
                    case 'm':
                        vpd.setMinute(value)
                        break
                    case 's':
                        vpd.setSecond(value)
                        break
                }

                if (!maxpd.isNull && vpd.Hms! > maxpd.Hms!) {
                    vpd.setValue(maxpd.valueString!)
                }

                if (!minpd.isNull && vpd.Hms! < minpd.Hms!) {
                    vpd.setValue(minpd.valueString!)
                }

                event.emit.updateModelValue(vpd.valueString)
            }
        }

        return {
            render: () => {
                return (
                    <div class="pl-time-base-panel">
                        {props.layout.map((layout: any) => (
                            <pl-time-base-column
                                {...{
                                    key: layout,
                                    layout,
                                    modelValue: (formatData as any).value.value[(TimePanelLayout as any)[layout]],
                                    max: (maxmin as any).value.max[(TimePanelLayout as any)[layout]],
                                    min: (maxmin as any).value.min[(TimePanelLayout as any)[layout]],
                                    checkDisabled: checkDisabled.value,
                                    custom: custom.value,
                                    onChange: (val: number) => handler.columnChange(val, layout),
                                    disableChangeOnScroll: props.disableChangeOnScroll,
                                }}
                            />
                        ))}
                    </div>
                )
            }
        }
    },
})