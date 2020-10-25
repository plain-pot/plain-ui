import {designComponent} from "../../use/designComponent";
import {reactive, watch, computed} from 'vue';
import './icon.scss'

export default designComponent({
    name: 'pl-icon',
    props: {
        icon: {type: String, required: true},
    },
    setup({props}) {

        const state = reactive({
            svg: null,
        })

        const styles = computed(() => {
            return {
                backgroundImage: `url(${state.svg})`,
            }
        })

        const utils = {
            reset: async () => {
                const svg = (await import('./assets/' + props.icon + '.svg')).default
                state.svg = svg
            }
        }

        watch(() => props.icon, utils.reset, {immediate: true})

        return {
            render() {
                return (
                    !!state.svg ? <i aria-hidden={true} style={styles.value} class="pl-icon"/> : null
                )
            },
        }
    },
})