import {designComponent} from "../../use/designComponent";
import {markRaw, ref, watch} from 'vue';
import './icon.scss'
import {VNodeChild} from "../../shims";

interface IconGetter {
    (icon: string): VNodeChild | Promise<VNodeChild>
}

const RegistryIcons = {
    icons: [] as { prefix: string, getter: IconGetter }[],
    registry(prefix: string, getter: IconGetter) {
        this.icons.unshift({prefix, getter})
    }
}

RegistryIcons.registry('el-icon-', async (icon) => {
    console.log('./icons/' + icon)
    const module = await import('./icons/' + icon)
    return (
        <svg viewBox="0 0 1024 1024"
             version="1.1"
             xmlns="http://www.w3.org/2000/svg"
             innerHTML={module.default}
        />
    )
})

export default designComponent({
    name: 'pl-icon',
    props: {
        icon: {type: String},

    },
    setup({props}) {

        const icon = ref(null as any)

        const utils = {
            getIconVNode: async (iconName: string) => {
                for (let i = 0; i < RegistryIcons.icons.length; i++) {
                    const registryIcon = RegistryIcons.icons[i];
                    if (iconName.indexOf(registryIcon.prefix) === 0) {
                        return await registryIcon.getter(iconName)
                    }
                }
                return null
            },
            reset: async (iconName: string) => {
                const Icon = await utils.getIconVNode(iconName)
                console.log('Icon', iconName, Icon)
                icon.value = !!Icon ? markRaw(Icon) : null
            }
        }

        watch(() => props.icon, val => !!val && utils.reset(val), {immediate: true})

        return {
            render: () => {
                const {value: Icon} = icon
                return !!Icon ? <Icon/> : null
            }
        }
    },
})