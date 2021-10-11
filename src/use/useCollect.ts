import {getCurrentInstance, inject, markRaw, onBeforeUnmount, onMounted, provide, ref, Ref, UnwrapRef,} from 'vue';
import {createCounter} from 'plain-utils/utils/createCounter'

type UseCollectComponent = { name?: string, use: { class: any } };
type UseCollectSort = (() => HTMLElement) | number;

interface ParentCollector<Child extends { use: { class: any } }> {

    (): UnwrapRef<Child['use']['class']>[],

    (flag: true): Ref<UnwrapRef<Child['use']['class']>[]>,

}

const counter = createCounter('use_collector');

function useCollectInParentInner() {
    const items = ref([] as any[]);
    const utils = {
        addItem: (item: any, sort?: UseCollectSort) => {
            if (sort) {
                if (typeof sort !== 'number') {
                    const el = sort();
                    // eslint-disable-next-line
                    sort = Array.from(el!.parentNode!.childNodes)
                        .filter(
                            (childNode: any) =>
                                childNode.nodeName !== '#comment' &&
                                childNode.nodeName !== '#text' &&
                                (!childNode.style || childNode.style.display !== 'none'),
                        )
                        .indexOf(el);
                }
                items.value.splice(sort, 0, item)
            } else {
                items.value.push(item);
            }
        },
        removeItem: (item: any) => {
            const index = items.value.indexOf(item);
            if (index > -1) items.value.splice(index, 1);
        },
    };
    return {
        parent: {} as any, // 类型提示，实际上无用处
        items,
        utils,
    };
}

export function useCollect<Parent extends UseCollectComponent, Child extends UseCollectComponent>(
    config: () => {
        parent: Parent;
        child: Child;
    },
) {
    const {parent} = config();
    const parentName = parent.name || counter();
    const provideString = `@@Collector_${parentName}`;

    const parentCollector: ParentCollector<Child> = ((flag?: true) => {
        const ctx = getCurrentInstance()!;
        const {items, utils} = useCollectInParentInner();
        const data: ReturnType<typeof useCollectInParentInner> = {
            items,
            utils,
            parent: ctx.proxy,
        };
        provide(provideString, data);
        return flag ? items : items.value;
    }) as any;

    return {
        parent: parentCollector,
        child: ({
                    injectDefaultValue,
                    sort,
                }: {
            injectDefaultValue?: any;
            sort?: UseCollectSort;
        } = {}): Parent['use']['class'] => {
            const data = inject(provideString, injectDefaultValue) as ReturnType<typeof useCollectInParentInner>;
            if (data) {
                const ctx = getCurrentInstance()!;
                const child = markRaw(ctx);
                onMounted(() => data.utils.addItem(child.proxy, sort));
                onBeforeUnmount(() => data.utils.removeItem(child.proxy));
                return data.parent;
            } else {
                return null;
            }
        },
    };
}
