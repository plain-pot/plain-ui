import {computed, designComponent} from 'plain-design-composition'
import './time-base-panel.scss'
import {TimePublicProps} from "./time-panel.utils";
import {plainDate} from "../../../utils/plainDate";
import PlTimeBaseColumn from "./PlTimeBaseColumn";

export enum TimePanelLayout {
    h = 'hour',
    m = 'minute',
    s = 'second',
}

export const PlTimeBasePanel = designComponent({
    name: 'pl-time-base-panel',
    props: {
        modelValue: {type: String},
        disableChangeOnScroll: {type: Boolean},// 是否禁用在滚动的时候触发更新值动作
        ...TimePublicProps,
    },
    emits: {
        onUpdateModelValue: (val: string | null) => true,
    },
    setup({props, event}) {

        const now = plainDate.today(props.displayFormat, props.valueFormat)

        const formatData = computed(() => {
            return {
                value: !props.modelValue ? now : plainDate(props.modelValue, props),
                max: !props.max ? null : plainDate(props.max, props),
                min: !props.min ? null : plainDate(props.min, props),
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

            if (!!maxpd) {
                max.hour = maxpd.hour
                if (!vpd) {
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

            if (!!minpd) {
                min.hour = minpd.hour
                if (!vpd) {
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
                // console.log('columnChange', {value, type})

                let {value: vpd, max: maxpd, min: minpd} = formatData.value

                switch (type) {
                    case 'h':
                        vpd = vpd.useHour(value)
                        break
                    case 'm':
                        vpd = vpd.useMinute(value)
                        break
                    case 's':
                        vpd = vpd.useSecond(value)
                        break
                }

                if (!!maxpd && vpd.Hms! > maxpd.Hms) {
                    vpd = maxpd
                }

                if (!!minpd && vpd.Hms! < minpd.Hms) {
                    vpd = minpd
                }

                event.emit.onUpdateModelValue(vpd.getValue())
            }
        }

        return {
            render: () => {
                return (
                    <div class="pl-time-base-panel">
                        {props.layout.map((layout: any) => (
                            <PlTimeBaseColumn
                                {...{
                                    key: layout,
                                    layout,
                                    modelValue: (formatData as any).value.value[(TimePanelLayout as any)[layout]],
                                    max: (maxmin as any).value.max[(TimePanelLayout as any)[layout]],
                                    min: (maxmin as any).value.min[(TimePanelLayout as any)[layout]],
                                    checkDisabled: checkDisabled.value!,
                                    custom: custom.value as any,
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

export default PlTimeBasePanel
