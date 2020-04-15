import {EmitMixin} from "../../../utils/mixins";

export class DateBasePanelItemData {
    label: string
    active: boolean
    now: boolean
    disabled: boolean
    hoverStart: boolean
    hover: boolean
    hoverEnd: boolean

    range: boolean

    [key: string]: any
}

export default {
    name: "pl-date-base-panel-item",
    mixins: [
        EmitMixin,
    ],
    emitters: {
        emitClick: Function,
        emitMouseenter: Function,
    },
    props: {
        item: {type: DateBasePanelItemData},
        component: {default: 'li'},
        componentProps: {type: Object},
    },
    render(h) {
        const Component = this.component
        return (
            <Component class={this.classes} {...{props: this.componentProps, on: this.listener}}>
                <div><span>{this.item.label}</span></div>
            </Component>
        )
    },
    computed: {
        classes() {
            return [
                'pl-date-base-panel-item', {
                    'pl-date-base-panel-item-active': this.item.active,
                    'pl-date-base-panel-item-now': this.item.now,
                    'pl-date-base-panel-item-disabled': this.item.disabled,
                    'pl-date-base-panel-item-hover-start': this.item.hoverStart,
                    'pl-date-base-panel-item-hover': this.item.hover,
                    'pl-date-base-panel-item-hover-end': this.item.hoverEnd,
                }
            ]
        },
        /**
         * 监听事件绑定对象，如果range=true为范围选择的情况下才会监听鼠标enter事件，否则只监听click事件
         * @author  韦胜健
         * @date    2020/4/15 11:09
         */
        listener() {
            if (this.item.disabled) {
                return {}
            }
            return {
                click: () => {
                    this.emitClick(this.item)
                },
                ...(this.item.range ? {
                    mouseenter: () => {
                        this.emitMouseenter(this.item)
                    },
                } : {})
            }
        },
    },
}