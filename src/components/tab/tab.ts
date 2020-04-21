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
    inject: {
        plTabGroup: {default: null}
    },
    computed: {
        classes() {
            return [
                this.groupClass,
                [`pl-tab-group-position-${this.position}`],
                [`pl-tab-group-card-${this.card}`],
            ]
        },
    },
    methods: {
        onMousewheelHeadList(e) {
            e.stopPropagation()
            e.preventDefault()
            const delta = e.deltaX || e.deltaY
            let oldLeft = this.$refs.scroll.p_wrapperScrollLeft
            this.$refs.scroll.scroll({x: delta + oldLeft})
        },
    },
}