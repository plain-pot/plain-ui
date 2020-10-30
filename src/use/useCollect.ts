import {ref, getCurrentInstance, provide, inject, onMounted, onBeforeUnmount, markRaw} from 'vue';
import {createCounter} from "../utils/createCounter";

type UseCollectComponent = { name?: string, use: { class: any } }

const parentCounter = createCounter('use_parent_collector')
const childCounter = createCounter('use_child_collector')

function useCollectInParentInner() {
    const items = ref([] as any[])
    const utils = {
        addItem: (item: any) => {
            items.value.push(item)
        },
        removeItem: (item: any) => {
            const index = items.value.indexOf(item)
            if (index > -1) items.value.splice(index, 1)
        }
    }
    return {
        parent: {} as any,  // 类型提示，实际上无用处
        items,
        utils,
    }
}

export function useCollect<Parent extends UseCollectComponent, Child extends UseCollectComponent>
(config: () => {
    parent: Parent,
    child: Child,
}) {

    const bakParentName = parentCounter()
    const bakChildName = childCounter()

    return {
        parent: (): (Child['use']['class'])[] => {

            const {parent, child} = config()
            const parentName = parent.name || bakParentName
            const childName = child.name || bakChildName
            const provideString = `${parentName}_${childName}`

            const ctx = getCurrentInstance()!
            const {items, utils} = useCollectInParentInner()
            const data: ReturnType<typeof useCollectInParentInner> = {
                items,
                utils,
                parent: ctx.proxy,
            }
            provide(provideString, data)
            return items.value
        },
        child: (
            {
                injectDefaultValue
            }: {
                injectDefaultValue?: any
            } = {}): Parent['use']['class'] => {

            const {parent, child} = config()
            const parentName = parent.name || bakParentName
            const childName = child.name || bakChildName
            const provideString = `${parentName}_${childName}`

            const data = inject(provideString, injectDefaultValue) as ReturnType<typeof useCollectInParentInner>
            if (!!data) {
                const ctx = getCurrentInstance()!
                const childCtx = markRaw(ctx.proxy as any)
                onMounted(() => data.utils.addItem(childCtx))
                onBeforeUnmount(() => data.utils.removeItem(childCtx))
                return data.parent
            } else {
                return null
            }
        }
    }
}