import {designComponent} from "../../use/designComponent";
import {markRaw, ref, watch, computed} from 'vue';
import './icon.scss'
import {VNodeChild} from "../../shims";

interface IconGetter {
    (icon: string): VNodeChild | Promise<VNodeChild>
}

const RegistryIcons = {
    icons: [] as { prefix: string, getter: IconGetter }[],
    /**
     * prefix必须为全小写，可以有横杠下划线
     * @author  韦胜健
     * @date    2020/11/1 12:59
     */
    registry(prefix: string, getter: IconGetter) {
        this.icons.unshift({prefix, getter})
    }
}

RegistryIcons.registry('el-icon-', async (icon) => {
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
        status: {type: String},
    },
    setup({props}) {

        const icon = ref(null as any)

        const classes = computed(() => [
            'pl-icon',
            {
                [`pl-icon-status-${props.status}`]: !!props.status
            }
        ])

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
                icon.value = !!Icon ? markRaw(Icon) : null
            }
        }

        watch(() => props.icon, val => !!val && utils.reset(val), {immediate: true})

        return {
            render: () => {
                const {value: Icon} = icon
                return !!Icon ? <Icon class={classes.value}/> : null
            }
        }
    },
})