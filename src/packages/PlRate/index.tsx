import {useClasses, InheritHtmlElement, computed, designComponent, reactive, useModel, useMounted, useRefs} from "plain-design-composition"
import {EditProps, useEdit} from "../../use/useEdit";
import {DEFAULT_STATUS, StyleProps, useStyle} from "../../use/useStyle";
import {disabledUserSelect} from "plain-utils/dom/disabledUserSelect";
import {enableUserSelect} from "plain-utils/dom/enableUserSelect";
import PlIcon from "../PlIcon";
import './rate.scss'

export const PlRate = designComponent({
    name: 'pl-rate',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {type: Number, default: 0},                         //vModel双向绑定值
        total: {type: Number, default: 5},                              //总分
        count: {type: Number, default: 5},                              //显示图标的个数
        mode: {type: String, default: 'normal'},                        //模式，normal，all整个图标为单位，half：半个图标为单位
        status: {type: String,},                                        //标准颜色
        activeIcon: {type: String},                                     //激活的时候的图标
        inactiveIcon: {type: String},                                   //未激活的时候的图标
    },
    emits: {
        onUpdateModelValue: (val: number) => true,
    },
    inheritPropsType: InheritHtmlElement,
    setup({props, event: {emit}}) {

        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
        })
        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
        const state = reactive({
            totalWidth: null as null | number,
            elLeft: null as null | number,
        })
        const {editComputed} = useEdit()
        const {styleComputed} = useStyle({status: DEFAULT_STATUS})

        const mounted = useMounted()

        /*---------------------------------------computer-------------------------------------------*/

        const classes = useClasses(() => ([
            `pl-rate`,
            `pl-rate-status-${styleComputed.value.status}`,
            `pl-rate-size-${styleComputed.value.size}`,
            {
                'pl-rate-disabled': editComputed.value.disabled,
            },
        ]))

        const data = computed(() => {
            let i = 0
            let ret: number[] = []
            while (i < props.count) {
                ret.push(i)
                i++
            }
            return ret
        })

        const activeStyles = computed(() => ({
            width: (model.value / props.total) * 100 + '%'
        }))

        const totalWidth = computed(() => {
            if (!mounted.value) return 0
            if (!state.totalWidth) state.totalWidth = refs.el!.offsetWidth
            return state.totalWidth
        })

        const elLeft = computed(() => {
            if (!state.elLeft) state.elLeft = refs.el!.getBoundingClientRect().left
            return state.elLeft
        })

        /*---------------------------------------methods-------------------------------------------*/


        const methods = {
            reset: (e: MouseEvent) => {
                let dur = e.clientX - (elLeft.value || 0)
                let start = 0
                let end = totalWidth.value
                let step = end / props.count
                switch (props.mode) {
                    case 'all':
                        for (; start < end; start += step) {
                            if (start < dur && dur < start + step) {
                                dur = start + step
                                break
                            }
                        }
                        break
                    case 'half':
                        for (; start < end; start += step) {
                            let half = (start + start + step) / 2
                            if (start < dur && dur < half) {
                                dur = half
                                break
                            }
                            if (half < dur && dur < start + step) {
                                dur = start + step
                                break
                            }
                        }
                        break
                }

                model.value = Number((Math.max(0, Math.min((dur) / totalWidth.value, 1)) * props.total).toFixed(2))
            },
        }

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            mousedown: (e: MouseEvent) => {
                if (!editComputed.value.editable) return
                window.document.addEventListener('mousemove', handler.mousemove)
                window.document.addEventListener('mouseup', handler.mouseup)
                disabledUserSelect()
                methods.reset(e)
            },
            mousemove: (e: MouseEvent) => {
                methods.reset(e)
            },
            mouseup: (e: MouseEvent) => {
                window.document.removeEventListener('mousemove', handler.mousemove)
                window.document.removeEventListener('mouseup', handler.mouseup)
                enableUserSelect()
            }
        }

        return {
            refer: {refs},
            render: () => (
                <div class={classes.value} onMousedown={handler.mousedown} ref={onRef.el}>
                    <div class="pl-rate-active" style={activeStyles.value}>
                        {data.value.map(i => <PlIcon icon={props.activeIcon || 'el-icon-star-on'} key={i}/>)}
                    </div>
                    <div class="pl-rate-inactive">
                        {data.value.map(i => <PlIcon icon={props.inactiveIcon || 'el-icon-star-off'} key={i}/>)}
                    </div>
                </div>
            )
        }
    },
})

export default PlRate
