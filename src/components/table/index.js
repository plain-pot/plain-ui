import $utils from '../../../src/scripts/utils'

/*表格相关组件通用mixin*/
const TableMixin = {
    props: {
        /*一下为base table可设置属性*/
        data: {type: Array, default: () => []},         //显示的数据数组
        showNum: {type: Number, default: 10},           //显示的行数，超过则会出现滚动条
        bodyRowHeight: {type: Number, default: 36},     //行高
        headRowHeight: {type: Number, default: 40},     //表头标题行显示高度
        noHeader: {type: Boolean},                      //不显示表头
        fitParent: {type: Boolean},                     //表格大小填满父元素
        sortField: {type: String},                      //当前排序字段
        sortDesc: {type: Boolean, default: true},       //当前排序方式

        /*以下为base table不可设置属性*/
        headColumns: {type: Array},                     //渲染表格头列信息数组
        bodyColumns: {type: Array},                     //渲染表体列信息数组
        fixedExist: {type: Object},                     //固定列是否存在
        fixed: {type: String, default: 'center'},       //固定表格的位置:left,center,right
        hostWidth: {type: Number},                      //宿主宽度
    },
}

const ColumnPublicProps = {
    title: {type: String},                              //列标题
    field: {type: String},                              //列绑定的字段
    width: {default: '200px'},                          //列宽度
    fit: {type: Number, default: 0},                    //当列不满表格宽度时，该列所占剩下宽度的权重
    order: {type: Number, default: 0},                  //列排序
    fixed: {type: String, default: 'center'},           //固定列位置
    placeLeft: {type: Boolean},                         //当出现左滚动列的时候，是否自动设置为左固定列
    placeRight: {type: Boolean},                        //当出现右滚动列的时候，是否自动设置为右固定列
    hide: {type: Boolean},                              //是否隐藏
    disabledConfig: {type: Boolean},                    //禁止配置改列
    align: {type: String, default: 'left'},             //非编辑状态下文本对其方式

    search: {type: Boolean, default: true},             //可查询
    searchField: {type: Boolean},                       //查询字段
    sort: {type: Boolean, default: true},               //可排序
    sortField: {type: Boolean},                         //排序字段
    editable: {type: Boolean, default: true},           //是否可编辑
    editableFunc: {type: Function},                     //是否可编辑判断函数

    dataType: {type: String},                           //数据格式化方式:tel,cny,money,percent
    formatter: {type: Function},                        //文本格式化函数，支持异步格式化
    tooltip: {type: Boolean},                           //是否tooltip显示文本
    link: {type: Boolean},                              //是否以超链接的形式展示文本，并且点击的时候回派发事件
    clickWhenIneditable: {type: Boolean, default: true},//只有非编辑状态下才能出发点击事件，否则任何状态都会触发点击事件
    showInDialog: {type: Boolean},                      //非编辑状态下是否点击后再dialog中显示

    required: {type: Boolean},                          //是否必输
    rules: {type: Array},                               //校验规则
    validFunc: {type: Function},                        //自定义验证函数
    validOnInit: {type: Boolean},                       //是否在初始化的时候进行校验
    requiredFunc: {type: Function},                     //是否必输

    quickFilter: {type: Boolean, default: false},       //可快速筛选，仅值列表列有效
    filterName: {type: String, default: 'input'},       //筛选组件名称
    filterOption: {type: Object},                       //筛选参数
    lov: {type: String},                                //值列表类型

    /*不可配置信息*/
    scopedSlots: {type: Object},                        //作用域插槽
    renderNormal: {type: Function},                     //渲染函数:非编辑状态
    renderEdit: {type: Function},                       //渲染函数：编辑状态
    renderHead: {type: Function},                       //渲染函数：列头
    propData: {type: Object},                           //列额外数据信息
}

const RefreshProps = [
    'fit',
    'order',
    'fixed,',
    'placeLeft',
    'placeRight',
    'hide',
    'disabledConfig',
    'scopedSlots',
    'renderNormal',
    'renderEdit',
    'renderHead',
]

const PublicColumnMixin = {
    props: ColumnPublicProps,
    computed: {
        columnBinding() {
            return Object.keys(ColumnPublicProps).reduce((ret, key) => {
                ret[key] = this[key]
                return ret
            }, {})
        },
    },
}

const ColumnGroupMixin = {
    props: {
        title: {},                                  //多级表头标题
        order: {type: Number, default: 0},          //多级表头排序序号
        fixed: {type: String, default: 'center'},   //多级表头固定位置
        placeLeft: {type: Boolean},                 //当出现左滚动列的时候，是否自动设置为左固定列
        placeRight: {type: Boolean},                //当出现右滚动列的时候，是否自动设置为右固定列
        /*不可配置属性*/
        isRoot: {type: Boolean},                    //是否为根列组件
    },
}

class TableColumn {
    constructor(context) {
        const originalProps = Object.keys(ColumnPublicProps).reduce((ret, key) => {
            // context.$set(ret, key, context[key])
            ret[key] = context[key]
            return ret
        }, {})
        originalProps.width = context.$plain.$utils.removePx(originalProps.width)
        this.originalProps = originalProps
        Object.assign(this, originalProps)
    }
}

class TableColumnGroup {
    constructor(context) {
        const originalProps = Object.keys(ColumnGroupMixin.props).reduce((ret, key) => {
            // context.$set(ret, key, context[key])
            ret[key] = context[key]
            return ret
        }, {})
        this.originalProps = originalProps
        Object.assign(this, originalProps)
        this.group = true
    }
}

class RowData {
    constructor(row, index, idField) {
        const id = row[idField]
        if (!id) {
            throw new Error(`The key field ${idField} is empty in ${JSON.stringify(row)}`)
        }
        Object.assign(this, {
            row,
            index,
            editRow: $utils.deepCopy(row),
            id,
            check: false,
            editable: false,
        })
    }
}

export {
    RowData,
    TableMixin,
    PublicColumnMixin,
    ColumnGroupMixin,
    TableColumn,
    TableColumnGroup,
    RefreshProps,
}