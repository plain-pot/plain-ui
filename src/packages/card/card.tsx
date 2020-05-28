import {computed, defineComponent} from "@vue/composition-api";
import {FormatPropsType, useProps} from "@/use/useProps";
import {StyleType} from "@/types/utils";
import {$plain} from "@/packages/base";
import {useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-card',
    props: {
        width: {type: [String, Number], default: '300px'},
        height: {type: [String, Number], default: '300px'},
        shadow: {type: String, default: 'always'},
    },
    setup(props) {

        const {slots} = useSlots()

        const propsState = useProps(props, {
            width: FormatPropsType.number,
            height: FormatPropsType.number,
        })

        const styles = computed(() => {
            const styles = {} as StyleType
            propsState.width !== null && (styles.width = $plain.utils.suffixPx(propsState.width))
            propsState.height !== null && (styles.height = $plain.utils.suffixPx(propsState.height))
            return styles
        })

        const classes = computed(() => [
            'pl-card',
            `pl-card-shadow-${props.shadow}`
        ])

        return () => (
            <div style={styles.value} class={classes.value}>
                {slots.default()}
            </div>
        )
    },
})