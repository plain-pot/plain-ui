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

export const TabMixin = {}