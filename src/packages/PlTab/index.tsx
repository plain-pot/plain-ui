import './tab.scss'
import {designComponent, InheritHtmlElement, useRefs} from "plain-design-composition";
import {TabCollector} from "../PlTabs";

export const PlTab = designComponent({
    inheritAttrs: false,
    inheritPropsType: InheritHtmlElement,
    props: {
        title: {type: String},                              // 页签标题
        init: {type: Boolean},                              // 是否立即初始化（默认第一次点击页签的时候才会初始化内容）
        val: {type: [String, Number]},                      // 页签唯一标识，用于 pl-tabs 绑定值
        destroyOnHide: {type: Boolean},                     // 是否再隐藏页签的时候销毁页签页面(重新打开页签的时候，页签内容会重新初始化)
    },
    slots: ['default'],
    scopeSlots: {
        head: (data: { active: boolean }) => {},
    },
    emits: {
        onClose: () => true,
    },
    setup({props, slots, scopeSlots, event, attrs}) {
        const {refs, onRef} = useRefs({
            el: HTMLSpanElement,
        })
        TabCollector.child({sort: () => refs.el!})
        // console.log('attrs', {...attrs})
        return {
            refer: {
                slots,
                scopeSlots,
                props,
                event,
                attrs,
            },
            render: () => (<span ref={onRef.el}>{props.title}</span>)
        }
    }
})

export type PlTabComponent = typeof PlTab.use.class

export default PlTab
