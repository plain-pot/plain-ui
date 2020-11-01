import {designComponent} from "../../use/designComponent";
import {ref, watch, computed} from 'vue';
import './icon.scss'
import {StyleProperties} from "../../shims";

const RegistryIcons = {
    registry: (prefix: string,) => {
        return null
    }
}

export default designComponent({
    name: 'pl-icon',
    props: {
        icon: {type: String},

    },
    setup({props}) {

        const icon = ref(null as null | string)

        const utils = {
            reset: async (iconName: string) => {
                return
            }
        }

        watch(() => props.icon, val => !!val && utils.reset(val), {immediate: true})

        return {
            render: () => {
                return (
                    <i class="pl-icon"
                       {...{innerHTML: '<button>hello world</button>'}}
                    />
                )
            }
        }
    },
})