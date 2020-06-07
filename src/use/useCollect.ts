import {getCurrentInstance, inject, onBeforeUnmount, onMounted, provide, ref} from "@vue/composition-api";

const COLLECT_PROVIDER = '@@COLLECT_PROVIDER'

function getIndex(el: HTMLElement): number {
    return Array
        .from(el!.parentNode!.childNodes)
        .filter((item: any) => item.nodeName !== '#comment' && (!item.style || item.style.display !== 'none'))
        .indexOf(el)
}

export function useCollectParent(
    {
        sort = false,
        onAdd,
        onRemove,
        provideString = COLLECT_PROVIDER,
    }: {
        sort: boolean,
        onAdd?: (addItem: any) => void,
        onRemove?: (removeItem: any) => void,
        provideString?: string
    } = {} as any) {
    const items = ref([] as any[])
    const utils = {
        addItem: (item) => {
            !!onAdd && onAdd(item)
            if (sort) {
                const index = getIndex(item.$el)
                items.value.splice(index, 0, item)
            } else {
                items.value.push(item)
            }
        },
        removeItem: (item) => {
            !!onRemove && onRemove(item)
            items.value.splice(items.value.indexOf(item), 1)
        },
    }

    provide(provideString, {
        utils,
    })

    return items
}

export function useCollectChild(
    {
        provideString = COLLECT_PROVIDER,
    }:
        {
            provideString: string
        } = {} as any) {
    const injectData = inject(provideString) as any
    const ctx = getCurrentInstance()


    if (!!injectData) {
        onMounted(() => {
            injectData.utils.addItem(ctx)
        })
        onBeforeUnmount(() => {
            injectData.utils.removeItem(ctx)
        })
    }
    return ctx
}