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
    title: {type: String},                      // 列标题
    // order: {type: Number},                      // 列排序
    // fixed: {type: String},                      // 冻结列位置：left、right、undefined
    // placeLeft: {type: String},                  // 当出现左固定列的时候，是否自动设置为左固定列
    // placeRight: {type: String},                 // 当出现右固定列的时候，是否自动设置为右固定列
}

export const PlcProps = {
    ...PlcGroupProps,
    field: {type: String},
    width: {default: '200px'},                          //列宽度
    // fit: {type: Number, default: 0},                    //当列不满表格宽度时，该列所占剩下宽度的权重
    // hide: {type: Boolean},                              //是否隐藏
    // align: {type: String, default: 'left'},             //非编辑状态下文本对其方式
    //
    // search: {type: Boolean, default: true},             //可查询
    // searchType: {type: String, default: 'input'},       //查询类型
    // searchField: {type: String},                        //查询字段
    //
    // sort: {type: Boolean, default: true},               //可排序
    // sortField: {type: String},                         //排序字段
    //
    // editable: {type: Boolean, default: true},           //是否可编辑
    // editableFunc: {type: Function},                     //是否可编辑判断函数
    //
    // formatter: {type: Function},                        //文本格式化函数，支持异步格式化
    // tooltip: {type: Boolean},                           //是否tooltip显示文本
    // link: {type: Boolean},                              //是否以超链接的形式展示文本，并且点击的时候回派发事件
    // showInDialog: {type: Boolean},                      //非编辑状态下是否点击后再dialog中显示
    //
    // required: {type: Boolean},                          //是否必输
    // rules: {type: Array},                               //校验规则
    //
    // /*---------------------------------------不可配置信息-------------------------------------------*/
    // scopedSlots: {type: Object},                        //作用域插槽
    // renderNormal: {type: Function},                     //渲染函数:非编辑状态
    // renderEdit: {type: Function},                       //渲染函数：编辑状态
    // renderHead: {type: Function},                       //渲染函数：列头
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

class Plc {
    children: Plc[]
    plcType: PlcType
    originProps: PlcPropsType
    props: PlcPropsType
    group: boolean
    title: string
    field: string

    constructor(plc) {
        const props = Object.keys(PlcProps).reduce((ret, propName) => {
            ret[propName] = plc[propName]
            return ret
        }, {}) as PlcPropsType

        Object.assign(this, {
            originProps: {...props},
            props: {...props},
            children: plc.children,
            plcType: plc.plcType,
            title: props.title,
            field: props.field,
        })
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
            children: [],
            plc: null,
        }
    },
    methods: {
        addItem({plc, $el}) {
            this.children.splice(Array.from($el.parentNode.childNodes).indexOf($el), 0, plc.plcType === PlcType.LIST ? plc.children : plc)
        },
        removeItem({plc}) {
            this.children.splice(this.children.indexOf(plc), 1)
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
    return plcList.reduce((ret: Plc[], plc: Plc | Plc[]) => {
        if (Array.isArray(plc)) {
            // plc list
            ret.push(...formatPlcList(plc))
        } else {
            // plc or group
            let {plcType, children} = plc
            if (plcType === PlcType.GROUP) {
                plc.children = formatPlcList(children)
                plc.group = true
            } else {
                delete plc.children
            }
            ret.push(plc)
        }
        return ret
    }, [])
}