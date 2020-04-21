export enum TabCardType {
    default = 'default',
    title = 'title',
    border = 'border',
}

export enum TabPosition {
    top = 'top',
    bottom = 'bottom',
    left = 'left',
    right = 'right',
}

export const TabProps = {
    value: {},
    card: {type: String, default: TabCardType.default},
    position: {type: String, default: TabPosition.top},

    items: {type: Array},
}

export const TabMixin = {
    computed: {
        classes() {
            return [
                this.className,
                [`pl-tab-group-position-${this.position}`],
                [`pl-tab-group-card-${this.card}`],
            ]
        },
    },
}