import {designComponent} from "../../../use/designComponent";
import {useSlots} from "../../../use/useSlots";
import {ComponentPublicInstance, getCurrentInstance, inject, onBeforeUnmount, onMounted, provide, ref} from 'vue';
import {PlcGroup, PlcType} from "./plc.type";

export const PlcCollector = (() => {
    const ProvideString = '@@PlcCollector'
    const parent = () => {
        const children = ref([] as ComponentPublicInstance[])
        const ctx = getCurrentInstance()!
        const refer = {
            ctx,
            children: children.value as any as (PlcType | PlcGroup)[],
            add: (proxy: ComponentPublicInstance) => {
                const el = proxy.$el as HTMLElement
                const index = Array.from(el.parentElement!.childNodes).indexOf(el)
                children.value.splice(index, 0, proxy)
            },
            remove: (proxy: ComponentPublicInstance) => {
                const index = children.value.indexOf(proxy)
                if (index > -1) {
                    children.value.splice(index, 1)
                }
            },
        }
        provide(ProvideString, refer)
        return refer
    }
    const child = () => {
        const {ctx: parentCtx, add, remove} = inject(ProvideString) as ReturnType<typeof parent>
        const childCtx = getCurrentInstance()!
        onMounted(() => add(childCtx.proxy!))
        onBeforeUnmount(() => remove(childCtx.proxy!))
        return {
            parent: parentCtx,
            ctx: childCtx,
        }
    }
    return {
        parent,
        child,
    }
})();

export default designComponent({
    name: 'plc-collector',
    setup() {
        const {slots} = useSlots()
        const {children} = PlcCollector.parent()
        return {
            refer: {
                children
            },
            render: () => (<div class="plc-collector">{slots.default()}</div>)
        }
    },
})