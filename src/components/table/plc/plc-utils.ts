export const PlcMixin = {
    inject: {
        plcNode: {default: null},
    },
    provide() {
        return {
            plcNode: this,
        }
    },
    data() {
        return {
            children: [],
        }
    },
    methods: {
        addItem(plc) {
            this.children.splice(Array.from(plc.$el.parentNode.childNodes).indexOf(plc.$el), 0, plc)
        },
        removeItem(plc) {
            this.children.splice(this.children.indexOf(plc), 1)
        },
    },
    mounted() {
        if (!!this.plcNode) {
            this.plcNode.addItem(this)
        }
    },
    beforeDestroy() {
        if (!!this.plcNode) {
            this.plcNode.removeItem(this)
        }
    },
}

export const PlcProps = {
    field: {type: String},
    title: {type: String},
}

export const enum PlcType {
    PLC = 'PLC',
    LIST = 'LIST',
    GROUP = 'GROUP',
}

export function formatPlcList(plcListChildren) {
    if (!plcListChildren) return []

    const newPlcListChildren = []

    plcListChildren.forEach((plc) => {
        const formatPlc = Object.keys(PlcProps).reduce((ret, key) => {
            ret[key] = plc[key]
            return ret
        }, {})

        let {plcNode, plcType, children} = plc

        if ((plcType === PlcType.GROUP || plcType === PlcType.LIST) && !!children) {
            children = formatPlcList(children)
        }

        if (plcType === PlcType.LIST) {
            // plc list
            newPlcListChildren.push(children)
        } else {
            // plc or group
            const source = plcType === PlcType.GROUP ? {plcNode, plcType, children} : {plcNode, plcType}
            Object.assign(formatPlc, source)
            newPlcListChildren.push(formatPlc)
        }
    })

    return newPlcListChildren.flat()
}