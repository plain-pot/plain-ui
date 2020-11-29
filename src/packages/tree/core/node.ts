import {computed, reactive} from 'vue';
import {useModel} from "../../../use/useModel";
import {createCounter} from "../../../utils/createCounter";
import {TreeNode, TreePropsType} from "./type";

const keyCounter = createCounter('tree')

export function useTree(
    {
        props,
        event,
    }: {
        props: {
            data?: any[],
            labelField?: string,
            keyField?: string,
            childrenField?: string,
            filterNodeMethod?: TreePropsType["filterNodeMethod"],
            isLeaf?: TreePropsType["isLeaf"],
            isCheckable?: TreePropsType["isCheckable"],
            lazy?: boolean,
        },
        event: {
            emit: { updateData: (data?: any[]) => void }
        },
    }) {

    const dataModel = useModel(() => props.data, event.emit.updateData)

    const state = reactive({
        expand: {} as Record<string, boolean>,
        check: {} as Record<string, boolean>,
        loading: {} as Record<string, boolean>,
        loaded: {} as Record<string, boolean>,
    })

    const format = (() => {
        const keyMap = new WeakMap<any, string>()
        return (
            data: any,
            level: number,
            parentRef: () => TreeNode
        ): TreeNode => {
            const childrenData = data[props.childrenField!] as (any[] | undefined)
            let key = keyMap.get(data)
            if (!key) {
                key = keyCounter()
                keyMap.set(data, key)
            }

            const node = {
                key,
                label: !!props.labelField ? data[props.labelField] : null,
                data,
                childrenData,
                children: undefined as undefined | TreeNode[],
                level,
                parentRef,

                isExpand: state.expand[key],
                isCheck: state.check[key],
                isLoading: state.loading[key],
                isLoaded: state.loaded[key],
                isCheckable: true,
                isLeaf: false,
                isVisible: false,
            }

            node.isCheckable = !props.isCheckable || props.isCheckable(node)
            node.isLeaf = !!props.isLeaf ? props.isLeaf(node) : !!childrenData
            node.isVisible = !props.filterNodeMethod ? true : props.filterNodeMethod(node)
            !!props.childrenField && !!childrenData && (node.children = childrenData.map(d => format(d, level + 1, () => node)));

            return node
        }
    })();

    const formatData = computed(() => (dataModel.value || []).map((data: any) => {
        return format(data, 1, () => ({
            key: '@@root',
            childrenData: data,
            level: 0,
        }) as any)
    }))

    const methods = {
        expand: (keyOrNode: string | TreeNode, flag: boolean) => state.expand[typeof keyOrNode === "string" ? keyOrNode : keyOrNode.key] = flag,
        check: (keyOrNode: string | TreeNode, flag: boolean) => state.check[typeof keyOrNode === "string" ? keyOrNode : keyOrNode.key] = flag,
        loading: (keyOrNode: string | TreeNode, flag: boolean) => state.loading[typeof keyOrNode === "string" ? keyOrNode : keyOrNode.key] = flag,
        loaded: (keyOrNode: string | TreeNode, flag: boolean) => state.loaded[typeof keyOrNode === "string" ? keyOrNode : keyOrNode.key] = flag,
    }

    return {
        formatData,
        methods,
    }
}