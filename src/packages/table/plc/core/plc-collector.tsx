import {designComponent} from "../../../../use/designComponent";
import {useSlots} from "../../../../use/useSlots";
import {ComponentPublicInstance, getCurrentInstance, inject, onBeforeUnmount, onMounted, provide, ref} from 'vue';
import {TablePlc} from "./plc.type";

export const TablePlcCollector = (() => {
    const ProvideString = '@@TablePlcCollector'
    const useParent = () => {
        const children = ref([] as TablePlc[])
        const refer = {
            children: children.value,
            add: (proxy: ComponentPublicInstance) => {
                const el = proxy.$el as HTMLElement
                const index = Array.from(el.parentElement!.childNodes)
                    .filter((item: any) => item.nodeName !== '#comment' && item.nodeName !== '#text' && (!item.style || item.style.display !== 'none'))
                    .indexOf(el)
                children.value.splice(index, 0, proxy as any)
            },
            remove: (proxy: ComponentPublicInstance) => {
                const index = children.value.indexOf(proxy as any)
                if (index > -1) {
                    children.value.splice(index, 1)
                }
            },
        }
        provide(ProvideString, refer)
        return refer
    }
    const useChild = () => {
        const {add, remove} = inject(ProvideString) as ReturnType<typeof useParent>
        const ctx = getCurrentInstance()!
        onMounted(() => add(ctx.proxy!))
        onBeforeUnmount(() => remove(ctx.proxy!))
        return ctx
    }
    return {
        useParent,
        useChild,
    }
})();

export default designComponent({
    name: 'plc-collector',
    setup() {
        const {slots} = useSlots()
        const {children} = TablePlcCollector.useParent()
        return {
            refer: {
                children
            },
            render: () => (
                <div class="plc-collector">
                    {slots.default()}
                </div>
            )
        }
    },
})