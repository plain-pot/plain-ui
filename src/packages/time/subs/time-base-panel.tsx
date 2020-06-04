import {computed, defineComponent} from "@vue/composition-api";
import {TimePublicProps} from "@/packages/time/subs/time-subs";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {PlainDate} from "@/util/PlainDate";

const layoutMap = {
    h: 'hour',
    m: 'minute',
    s: 'second',
}

export default defineComponent({
    name: 'pl-time-base-panel',
    props: {
        value: {type: String},
        ...TimePublicProps,
    },
    setup(props) {

        const {emit} = useEvent({
            input: EmitFunc,
            mousedownPanel: EmitFunc,
        })

        const formatData = computed(() => {
            return {
                value: new PlainDate(props.value, props.displayFormat, props.valueFormat),
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

        const checkDisabled = computed(() => !props.checkDisabled ? null : (num, layout) => props.checkDisabled!(num, layout, formatData.value.value))

        const custom = computed(() => !props.custom ? null : (layout) => props.custom!(layout, formatData.value.value))

        const handler = {
            columnChange: (value, type) => {
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

                emit.input(vpd.valueString)
            }
        }

        return () => {
            return (
                <div class="pl-time-base-panel" onMousedown={emit.mousedownPanel}>
                    {props.layout.map(layout => (
                        <pl-time-base-column layout={layout}
                                             value={formatData.value.value[layoutMap[layout as string]]}
                                             max={maxmin.value.max[layoutMap[layout as string]]}
                                             min={maxmin.value.min[layoutMap[layout as string]]}
                                             checkDisabled={checkDisabled.value}
                                             custom={custom.value}
                                             onChange={val => handler.columnChange(val, layout)}/>
                    ))}
                </div>
            )
        }
    },
})