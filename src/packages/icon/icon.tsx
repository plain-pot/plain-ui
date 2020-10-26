import {designComponent} from "../../use/designComponent";
import {ref, watch, computed} from 'vue';
import './icon.scss'

export default designComponent({
    name: 'pl-icon',
    props: {
        icon: {type: String},

    },
    setup({props}) {
        const icon = ref(null as any)

        const styles = computed(() => {
            const ret = {} as any
            ret.backgroundImage = `url(${icon.value})`
            return ret
        })

        const utils = {
            reset: async (iconName: string) => {
                const svg = (await import('./icons/' + iconName + '.svg')).default
                icon.value = svg
                console.log(icon.value)
            }
        }

        watch(() => props.icon, val => !!val && utils.reset(val), {immediate: true})

        return {
            render: () => {
                if (!icon.value) {
                    return null
                }
                return <i class="pl-icon" style={styles.value}/>
            }
        }
    },
})