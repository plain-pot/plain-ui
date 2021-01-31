import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useScopedSlots} from "../../use/useScopedSlots";
import {TabCollector} from "./tabs";
import {useRefs} from "../../use/useRefs";

export const PlTab = designComponent({
    name: 'pl-tab',
    props: {
        title: {type: String},                              // 页签标题
        init: {type: Boolean},                              // 是否立即初始化（默认第一次点击页签的时候才会初始化内容）
        val: {type: [String, Number]},                      // 页签唯一标识，用于 pl-tabs 绑定值
        destroyOnHide: {type: Boolean},                     // 是否再隐藏页签的时候销毁页签页面(重新打开页签的时候，页签内容会重新初始化)
    },
    setup({props}) {
        const {refs} = useRefs({
            el: HTMLSpanElement,
        })
        const {slots} = useSlots()
        const {scopedSlots} = useScopedSlots({
            head: {active: Boolean},
        })
        TabCollector.child({sort: () => refs.el})

        return {
            refer: {
                slots,
                scopedSlots,
                props,
            },
            render: () => (<span ref="el">{props.title}</span>)
        }
    },
})