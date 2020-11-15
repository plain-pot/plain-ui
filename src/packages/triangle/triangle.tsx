import {designComponent} from "../../use/designComponent";
import {useRefs} from "../../use/useRefs";
import {useProps} from "../../use/useProps";
import {computed, onMounted} from 'vue';
import {useStyles} from "../../use/useStyles";
import {unit} from 'plain-utils/string/unit';
import './triangle.scss'

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

export default designComponent({
    name: 'pl-triangle',
    props: {
        direction: {type: String, default: 'top'},
        half: {type: String},
        size: {type: [Number, String], default: 20},
    },
    setup({props}) {
        const {refs} = useRefs({
            el: HTMLDivElement,
        })

        const {propsState} = useProps(props, {
            size: useProps.NUMBER,
        })

        const classes = computed(() => [
            'pl-triangle',
            `pl-triangle-direction-${props.direction}`,
            {
                [`pl-triangle-half-${props.half}`]: !!props.half
            }
        ])

        const styles = useStyles(style => {
            if (!props.half) {
                return style
            }
            if (props.direction === 'top' || props.direction === 'bottom') {
                style.width = unit(propsState.size)
            } else {
                style.height = unit(propsState.size)
            }
            return style
        })

        const targetStyles = useStyles((style: any) => {

            style.border = `solid transparent ${unit(propsState.size)}`
            style[`border${uppercaseFirstLetter(props.direction)}Width`] = '0'
            style[`border${uppercaseFirstLetter((DirectionMap as any)[props.direction])}Color`] = 'currentColor'

            if (!!props.half) {
                if (props.direction === 'top' || props.direction === 'bottom') {
                    props.half === 'end' && (style.right = unit(propsState.size))
                } else {
                    props.half === 'end' && (style.bottom = unit(propsState.size))
                }
            }

            return style
        })

        if (propsState.size == null) {
            onMounted(() => {
                propsState.size = (refs.el!.parentNode as HTMLDivElement).offsetHeight / 2
            })
        }

        return {
            render: () => (
                propsState.size == null ? <span ref="el" style="display:none"/> : (
                    <div class={classes.value} style={styles.value} ref="el">
                        <div class="pl-triangle-target" style={targetStyles.value}/>
                    </div>
                )
            )
        }
    },
})