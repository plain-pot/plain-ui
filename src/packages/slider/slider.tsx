import {designComponent} from "../../use/designComponent";
import {StyleProps, useStyle} from "../../use/useStyle";
import {EditProps, useEdit} from "../../use/useEdit";
import {useRefs} from "../../use/useRefs";
import {useMounted} from "../../use/useMounted";
import {useModel} from "../../use/useModel";
import {reactive, computed} from 'vue';
import {DEFAULT_STATUS} from "../../utils/constant";
import {unit} from "plain-utils/string/unit";
import {removeUnit} from "plain-utils/string/removeUnit";
import {disabledUserSelect} from "plain-utils/dom/disabledUserSelect";
import {enableUserSelect} from "plain-utils/dom/enableUserSelect";
import './slider.scss'

export default designComponent({
    name: 'pl-slider',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {type: Number, default: 0},                          //非范围选择时，双向绑定值
        start: {type: Number, default: 0},                          //范围选择时，起始绑定值
        end: {type: Number, default: 0},                            //范围选择时，末尾绑定值
        total: {type: Number, default: 100},                        //总数，value,start以及end不应该超过total
        alignEnd: {type: Boolean},                                  //是否末尾对其
        full: {type: Boolean},                                      //是否占满父元素大小
        length: {type: [Number, String], default: '156px'},         //滑动条长度
        size: {type: [Number, String], default: '6px'},             //滑动条宽度
        vertical: {type: Boolean},                                  //是否纵向
        step: {type: Number, default: 1},                           //滑条分块的个数，默认是不分块
        min: {type: Number},                                        //最小值
        max: {type: Number},                                        //最大值

        showSteps: {type: Boolean, default: true},                  //是否显示步骤点
        tooltip: {type: Boolean, default: true},                    //是否tooltip显示值
        tooltipFormatter: Function,                                 //tooltip显示格式化函数
        range: {type: Boolean},                                     //是否为范围选择
    },
    emits: {
        onUpdateModelValue: (val: number) => true,
        onUpdateStart: (val: number) => true,
        onUpdateEnd: (val: number) => true,
    },
    setup({props, event: {emit}}) {

        const {refs} = useRefs({
            el: HTMLDivElement,
        })

        /*---------------------------------------state-------------------------------------------*/

        const {editComputed} = useEdit()
        const {styleComputed} = useStyle({status: DEFAULT_STATUS})

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
        const start = useModel(() => props.start, emit.onUpdateStart)
        const end = useModel(() => props.end, emit.onUpdateEnd)

        const isMounted = useMounted()

        const state = reactive({
            dragStart: null as null | boolean,
            touching: false,
            tempStart: null as null | number,
            tempEnd: null as null | number,
            startX: null as null | number,
            startY: null as null | number,
            totalLength: null as null | number,
            position: {
                'vertical-start': 'bottom',
                'vertical-end': 'top',
                'horizontal-start': 'right',
                'horizontal-end': 'left',
            },
        })

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            transferValueToLength(value: number) {
                return totalLength.value * value / props.total
            },
            transferLengthToValue(length: number) {
                return props.total * length / totalLength.value
            },
            setValue(val: number) {
                model.value = val
            },
            setStart(val: number) {
                start.value = val
            },
            setEnd(val: number) {
                end.value = val
            },
        }

        /*---------------------------------------computer-------------------------------------------*/

        const styles = computed(() => ({
            [props.vertical ? 'height' : 'width']: !!props.full ? '100%' : unit(props.length),
            [props.vertical ? 'width' : 'height']: unit(props.size),
        }))

        const classes = computed(() => ([
            'pl-slider',
            {
                'pl-slider-full': !!props.full,
                'pl-slider-touching': state.touching,
                'pl-slider-range': props.range,
                'pl-slider-place-end': start.value === end.value && start.value === props.total
            },
            `pl-slider-${!!props.vertical ? 'vertical' : 'horizontal'}`,
            `pl-slider-align-${!!props.alignEnd ? 'end' : 'start'}`,
            `pl-slider-status-${!!editComputed.value.disabled ? 'info' : (styleComputed.value.status)}`,
        ]))

        const totalLength = computed(() => {
            if (!isMounted.value) return 0
            if (state.totalLength == null) state.totalLength = refs.el![!!props.vertical ? 'offsetHeight' : 'offsetWidth']
            return state.totalLength
        })

        const startPosition = computed(() => {
            return !!props.range ? utils.transferValueToLength(start.value) : props.alignEnd ? (totalLength.value - utils.transferValueToLength(model.value)) : 0
        })

        const endPosition = computed(() => {
            return !!props.range ? totalLength.value - utils.transferValueToLength(end.value) : props.alignEnd ? 0 : (totalLength.value - utils.transferValueToLength(model.value))
        })

        const progressStyles = computed(() => {
            const ret = {} as any
            ret[props.vertical ? 'top' : 'left'] = `${startPosition.value}px`
            ret[props.vertical ? 'bottom' : 'right'] = `${endPosition.value}px`
            return ret
        })

        const startTooltip = computed(() => {
            let ret = !!props.range ? start.value : model.value
            return !!props.tooltipFormatter ? props.tooltipFormatter(ret) : ret
        })

        const endTooltip = computed(() => {
            let ret = !!props.range ? end.value : model.value
            return !!props.tooltipFormatter ? props.tooltipFormatter(ret) : ret
        })

        const steps = computed(() => {
            const ret: number[] = []
            let i = 0
            while (i < props.step - 1) {
                ret.push(i)
                i++
            }
            return ret
        })

        const stepItemStyles = computed(() => {
            return {
                ['height']: unit(removeUnit(props.size) as any / 2),
                ['width']: unit(removeUnit(props.size) as any / 2),
            }
        })

        const handler = {
            dragstart: (e: MouseEvent, dragStart: boolean) => {
                if ((!!props.alignEnd !== dragStart && !props.range) || !editComputed.value.editable) return
                document.addEventListener('mousemove', handler.mousemove)
                document.addEventListener('mouseup', handler.mouseup)
                state.dragStart = dragStart
                state.touching = true
                state.startX = e.clientX
                state.startY = e.clientY
                state.tempStart = startPosition.value
                state.tempEnd = endPosition.value
                disabledUserSelect()
            },
            mousemove: (e: MouseEvent) => {
                if (!state.touching) return
                const durX = e.clientX - state.startX!
                const durY = e.clientY - state.startY!
                let temp = !!state.dragStart ? state.tempStart : state.tempEnd
                let dur = (!!props.vertical ? durY : durX) * (!!state.dragStart ? 1 : -1)
                let ret = Math.min(Math.max(temp! + dur, 0), totalLength.value)

                if (props.step > 1) {
                    const stepLength = totalLength.value / props.step
                    const divisor = Number((ret / stepLength).toFixed(0)) + 1
                    if (ret > stepLength * divisor) ret = stepLength * divisor
                    else ret = stepLength * (divisor - 1)
                }

                if (!!state.dragStart) {
                    start.value = utils.transferLengthToValue(ret)
                } else {
                    end.value = utils.transferLengthToValue(ret)
                }

                if (!props.range) {
                    ret = Number(utils.transferLengthToValue(totalLength.value - ret).toFixed(2))
                    props.max != null && ret > props.max && (ret = props.max)
                    props.min != null && ret < props.min && (ret = props.min)
                    utils.setValue(ret)
                } else {
                    ret = Number(utils.transferLengthToValue(state.dragStart ? ret : totalLength.value - ret).toFixed(2))
                    props.max != null && ret > props.max && (ret = props.max)
                    props.min != null && ret < props.min && (ret = props.min)
                    if (!!state.dragStart) {
                        if (ret > end.value) ret = end.value
                    } else {
                        if (ret < start.value) ret = start.value
                    }
                    state.dragStart ? utils.setStart(ret) : utils.setEnd(ret)
                }
            },
            mouseup: (e: MouseEvent) => {
                if (!state.touching) return
                state.touching = false
                document.removeEventListener('mousemove', handler.mousemove)
                document.removeEventListener('mouseup', handler.mouseup)
                enableUserSelect()
            }
        }

        return {
            render: () => (
                <div class={classes.value} style={styles.value} ref={'el'}>
                    {
                        props.showSteps && props.step > 1 && (
                            <div class="pl-slider-step">
                                {
                                    steps.value.map((item) => (
                                        <span class="pl-slider-step-item-wrapper" key={item}>
                                        <div class="pl-slider-step-item" style={stepItemStyles.value as any}/>
                                    </span>
                                    ))
                                }
                            </div>
                        )
                    }
                    <div class="pl-slider-progress" style={progressStyles.value}>
                <span class="pl-slider-dot-wrapper pl-slider-dot-wrapper-start" onMousedown={(e: MouseEvent) => handler.dragstart(e, true)}><span class="pl-slider-dot"><span class="pl-slider-dot-inner">
                    {!!props.tooltip && <span class="pl-slider-dot-tooltip">{startTooltip.value}</span>}
                </span></span></span>
                        <span class="pl-slider-dot-wrapper pl-slider-dot-wrapper-end" onMousedown={e => handler.dragstart(e, false)}><span class="pl-slider-dot"><span class="pl-slider-dot-inner">
                    {!!props.tooltip && <span class="pl-slider-dot-tooltip">{endTooltip.value}</span>}
                </span></span></span>
                    </div>
                </div>
            )
        }
    },
})