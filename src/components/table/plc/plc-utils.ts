export const enum PlcFixedType {
    left = 'left',
    right = 'right',
}

export const enum PlcType {
    PLC = 'PLC',
    LIST = 'LIST',
    GROUP = 'GROUP',
}

export const enum PlcAlign {
    left = 'left',
    center = 'center',
    right = 'right'
}

export const PlcGroupProps = {
    title: {type: String},                                                  // 列标题
    align: {type: String, default: 'left', watch: true},                    //非编辑状态下文本对其方式

    // order: {type: Number},                                               // 列排序
    // fixed: {type: String},                                               // 冻结列位置：left、right、undefined
    // placeLeft: {type: String},                                           // 当出现左固定列的时候，是否自动设置为左固定列
    // placeRight: {type: String},                                          // 当出现右固定列的时候，是否自动设置为右固定列
}

export const PlcProps = {
    ...PlcGroupProps,
    field: {type: String},
    width: {default: '200px', watch: true, formatNumber: true},             //列宽度
    fit: {type: Number, default: 0},                                        //当列不满表格宽度时，该列所占剩下宽度的权重
    // hide: {type: Boolean},                                               //是否隐藏
    //
    // search: {type: Boolean, default: true},                              //可查询
    // searchType: {type: String, default: 'input'},                        //查询类型
    // searchField: {type: String},                                         //查询字段
    //
    // sort: {type: Boolean, default: true},                                //可排序
    // sortField: {type: String},                                           //排序字段
    //
    // editable: {type: Boolean, default: true},                            //是否可编辑
    // editableFunc: {type: Function},                                      //是否可编辑判断函数
    //
    // formatter: {type: Function},                                         //文本格式化函数，支持异步格式化
    // tooltip: {type: Boolean},                                            //是否tooltip显示文本
    // link: {type: Boolean},                                               //是否以超链接的形式展示文本，并且点击的时候回派发事件
    // showInDialog: {type: Boolean},                                       //非编辑状态下是否点击后再dialog中显示
    //
    // required: {type: Boolean},                                           //是否必输
    // rules: {type: Array},                                                //校验规则
    //
    // /*---------------------------------------不可配置信息-------------------------------------------*/
    // scopedSlots: {type: Object},                                         //作用域插槽
    // renderNormal: {type: Function},                                      //渲染函数:非编辑状态
    // renderEdit: {type: Function},                                        //渲染函数：编辑状态
    // renderHead: {type: Function},                                        //渲染函数：列头
}

interface PlcGroupPropsType {
    title: string
    order: number
    fixed: PlcFixedType
    placeLeft: boolean
    placeRight: boolean
}

interface PlcPropsType extends PlcGroupPropsType {
    field: string
    width: number
    fit: number
    hide: boolean
    align: PlcAlign

    search: boolean
    searchType: string
    searchField: string

    sort: boolean
    sortField: string

    editable: boolean
    editableFunc: () => boolean

    formmatter: string | Function
    tootip: boolean
    link: boolean
    showInDialog: boolean

    required: boolean
    rules: Object[] | Object

    scopedSlots: { [key: string]: Function }
    renderNormal: Function
    renderEdit: Function
    renderHead: Function
}

export class Plc {

    title: string
    field: string

    items: Plc[]
    plcType: PlcType

    originProps: PlcPropsType
    props: PlcPropsType
    children: Plc[]
    group: boolean
    colspan: number
    rowspan: number
    level: number

    constructor(plc) {
        const props = Object.keys(PlcProps).reduce((ret, propName) => {
            let val = plc[propName]
            if (PlcProps[propName].formatNumber) {
                if (typeof val === "string" && (/^[\d]+$/.test(val) || val.endsWith('px'))) {
                    val = Number(val.replace('px', ''))
                }
            }
            ret[propName] = val
            return ret
        }, {}) as PlcPropsType

        Object.assign(this, {
            originProps: {...props},
            props: {...props},
            items: plc.items,
            plcType: plc.plcType,
            title: props.title,
            field: props.field,
        })
    }

    setDurWidth(durWidth: number) {
        if (!this.group) {
            this.originProps.width = this.props.width + durWidth
        } else {
            const itemDurWidth = durWidth / this.items.length
            this.children.forEach(child => child.setDurWidth(itemDurWidth))
        }
    }
}

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
            items: [],
            plc: null,
        }
    },
    methods: {
        addItem({plc, $el}) {
            this.items.splice(Array.from($el.parentNode.childNodes).indexOf($el), 0, plc)
        },
        removeItem({plc}) {
            this.items.splice(this.items.indexOf(plc), 1)
        },
        setProps(propName: string, val: any) {
            if (!this.plc) return
            this.plc.originProps[propName] = val
            this.plc.props[propName] = val
        },
    },
    mounted() {
        this.plc = new Plc(this)
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

export function formatPlcList(plcList: Plc[]): Plc[] {
    if (!plcList) return []

    return plcList.reduce((ret: Plc[], plc: Plc) => {

        switch (plc.plcType) {
            case PlcType.LIST:
                ret.push(...formatPlcList(plc.items))
                break
            case PlcType.GROUP:
                plc.children = formatPlcList(plc.items)
                plc.group = true
                ret.push(plc)
                break
            case PlcType.PLC:
                ret.push(plc)
                break
        }

        return ret
    }, [])
}

export function getPlcWatch(plcProps): Object {
    return Object.keys(plcProps).reduce((ret, propName) => {

        if (!!plcProps[propName].watch) {
            ret[propName] = function (val) {
                if (!this.plc) {
                    return
                }
                if (plcProps[propName].formatNumber) {
                    if (typeof val === "number") {
                        this.setProps(propName, val)
                    } else {
                        val = String(val)
                        if (/^[\d]+$/.test(val) || val.endsWith('px')) {
                            val = Number(val.replace('px', ''))
                        }
                        this.setProps(propName, val)
                    }
                } else {
                    this.setProps(propName, val)
                }
            }
        }

        return ret
    }, {})
}