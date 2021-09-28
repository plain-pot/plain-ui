import './progress-mini.scss'
import {computed,InheritHtmlElement, designComponent, useModel, useRefs, useStyles, watch} from "plain-design-composition";
import {PROGRESS_DEFAULT_PROPS} from "../PlProgressBar/progress.utils";
import {createAnimate} from "../../utils/createAnimate";
import {unit} from "plain-utils/string/unit";
import {useClasses} from "plain-design-composition";

export const PlProgressMini = designComponent({
    name: 'pl-progress-mini',
    props: {
        size: {default: 28},
        ...PROGRESS_DEFAULT_PROPS,
        innerColor: {type: String, default: 'rgba(0,0,0,0.25)'},
        round: {type: Boolean},
    },
    inheritPropsType: InheritHtmlElement,
    setup({props}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})
        const model = useModel(() => 0, () => undefined, {autoWatch: false})

        const animate = createAnimate({
            time: 300,
            initValue: () => model.value || 0,
            action: val => model.value = val,
        })

        const styles = useStyles(style => {
            style.height = unit(props.size)
            style.width = unit(props.size)
        })

        const classes = useClasses(() => [
            'pl-progress-mini',
            {
                [`pl-progress-mini-status-${props.status}`]: !!props.status,
                [`pl-progress-mini-round`]: props.round,
            },
        ])

        const percent = computed(() => 1 - (model.value == null ? 0 : model.value / 100))

        const radius = computed(() => 50 - 2 / 2)

        const pathD = computed(() => {
            let d = [`M 50 1`] as (string | number)[]
            const r = radius.value
            const p = percent.value /*小于1的百分比数字*/

            const degrees = Math.PI * 2 * p

            d.push(`A ${r} ${r} 0`)
            d.push(p > 0.5 ? 1 : 0)
            d.push(0)
            d.push(`${50 - r * Math.sin(degrees)} ${50 - r * Math.cos(degrees)}`)

            d.push(`L 50 50 L 50 1`)

            return d.join(' ')
        })


        const pathStroke = computed(() => {
            switch (props.status) {
                case 'success':
                    return props.successColor
                case 'error':
                    return props.errorColor
                default:
                    return props.innerColor
            }
        })

        watch(() => props.modelValue, val => animate.start(val), {immediate: true})

        return {
            refer: {refs},
            render: () => (
                <div class={classes.value} style={styles.value} ref={onRef.el}>
                    <svg viewBox="0 0 100 100">
                        {model.value == 0 ? (
                            <circle cx="50" cy="50" r={radius.value} fill={pathStroke.value}/>
                        ) : (
                            <path
                                d={pathD.value}
                                stroke="none"
                                fill={pathStroke.value}
                            />
                        )}
                    </svg>
                </div>
            )
        }
    },
})

export default PlProgressMini
