import {computed, defineComponent, onMounted} from "@vue/composition-api";
import {FormatPropsType, useProps} from "@/use/useProps";
import {StyleType} from "@/types/utils";
import {$plain} from "@/packages/base";
import {useRefs} from "@/use/useRefs";

const DirectionMap = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
}

function uppercaseFirstLetter(name: string): string {
    if (!name) return name
    return name.charAt(0).toUpperCase() + name.slice(1)
}

export default defineComponent({
    name: 'pl-triangle',
    props: {
        direction: {type: String, default: 'top'},
        half: {type: String},
        size: {type: [Number, String], default: 20},
    },
    setup(props) {

        const refs = useRefs()

        const propsState = useProps(props, {
            size: FormatPropsType.number,
        })

        const classes = computed(() => [
            'pl-triangle',
            `pl-triangle-direction-${props.direction}`,
            {
                [`pl-triangle-half-${props.half}`]: !!props.half
            }
        ])

        const styles = computed(() => {
            const ret = {} as StyleType
            if (!props.half) {
                return ret
            }
            if (props.direction === 'top' || props.direction === 'bottom') {
                ret.width = $plain.utils.suffixPx(propsState.size)
            } else {
                ret.height = $plain.utils.suffixPx(propsState.size)
            }
            return ret
        })

        const targetStyles = computed(() => {
            const ret = {} as StyleType
            ret.border = `solid transparent ${$plain.utils.suffixPx(propsState.size)}`
            ret[`border${uppercaseFirstLetter(props.direction)}Width`] = '0'
            ret[`border${uppercaseFirstLetter(DirectionMap[props.direction])}Color`] = 'currentColor'

            if (!!props.half) {
                if (props.direction === 'top' || props.direction === 'bottom') {
                    props.half === 'end' && (ret.right = $plain.utils.suffixPx(propsState.size))
                } else {
                    props.half === 'end' && (ret.bottom = $plain.utils.suffixPx(propsState.size))
                }
            }

            return ret
        })

        if (propsState.size == null) {
            onMounted(() => {
                // @ts-ignore
                propsState.size = refs.$el.parentNode.offsetHeight / 2
            })
        }

        return () => (
            propsState.size == null ? null : (
                <div class={classes.value} style={styles.value}>
                    <div class="pl-triangle-target" style={targetStyles.value}/>
                </div>
            )
        )
    },
})