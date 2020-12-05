import {designComponent} from "../../use/designComponent";
import {PROGRESS_DEFAULT_PROPS} from "./progress.utils";
import {computed} from 'vue';
import {useStyles} from "../../use/useStyles";
import {unit} from 'plain-utils/string/unit';

export const ProgressMini = designComponent({
    name: 'pl-progress-mini',
    props: {
        size: {default: 28},
        ...PROGRESS_DEFAULT_PROPS,
        innerColor: {type: String, default: 'rgba(0,0,0,0.25)'},
        round: {type: Boolean},
    },
    setup({props}) {

        const styles = useStyles(style => {
            style.height = unit(props.size)
            style.width = unit(props.size)
        })

        const classes = computed(() => [
            'pl-progress-mini',
            {
                [`pl-progress-mini-status-${props.status}`]: !!props.status,
                [`pl-progress-mini-round`]: props.round,
            },
        ])

        const percent = computed(() => 1 - (props.modelValue == null ? 0 : props.modelValue / 100))

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

        return {
            render: () => (
                <div class={classes.value} style={styles.value}>
                    <svg viewBox="0 0 100 100">
                        {props.modelValue == 0 ? (
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