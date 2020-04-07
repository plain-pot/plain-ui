import {CascadeData, CascadeMark} from "./CascadeData";
import {EmitMixin} from "../../utils/mixins";

export default {

    name: "pl-cascade-panel",
    mixins: [EmitMixin],
    props: {
        value: {type: Array},                                               // 数组，双向绑定值
        data: {type: Array},                                                // 选择的数据
        trigger: {type: Array},                                             // 展开触发类型：click，hover
        // showFormat: {type: Function},                                       // 格式化显示值函数
        // separator: {type: String, default: ' / '},                          // 显示值分隔符
        // filterable: {type: Boolean},                                        // 是否可筛选
        // filterMethod: {type: Boolean},                                      // 自定义筛选函数
        emptyText: {type: Boolean, default: '暂无数据'},                    // 没有子节点时展示的文本

        isLeaf: {type: Function},                                           // 函数，用来判断是否为叶子节点，默认根据节点是否存在子节点来判断是否为叶子节点，懒加载模式下，改属性为必需属性
        lazy: {type: Boolean},                                              // 数据是否为懒加载
        getChildren: {type: Function},                                      // 懒加载数据函数

        labelField: {type: String},                                         // 记录显示文本的字段名
        keyField: {type: String},                                           // 记录值的字段名
        childrenField: {type: String},                                      // 记录的子节点数据的字段名
    },
    emitters: {
        emitInput: Function,
    },
    data() {
        const p_value: string[] = this.value                                // value内置临时变量
        const p_data = this.data                                            // data的临时变量，因为可能需要懒加载数据，所以数据需要内部管理
        const formatCount: number = 0;                                      // 当前格式化数据的时候，数据的版本，用来清理mark中不需要保存的数据
        let rootData: CascadeData = new CascadeData({}, this, 0);           // 根节点 treeNode对象
        const mark: { [key: string]: CascadeMark } = {}                     // 标记映射
        const p_loading: boolean = false                                    // 内置，当前是否处于loading状态

        const expandKeys = p_value || []

        return {
            p_data,
            p_value,
            rootData,
            formatCount,
            mark,
            p_loading,
            expandKeys,
        }
    },
    created() {
    },
    render(h) {
        return (
            <div class="pl-cascade-panel">
                {this.cascadeData.map((list: CascadeData[], listIndex) => (
                    <div class="pl-cascade-list" key={listIndex}>
                        <pl-scroll>
                            <pl-list>
                                {list.map((node) => (
                                    <pl-item block
                                             class={['pl-cascade-item', {'pl-cascade-item-expand': node.key === this.expandKeys[listIndex]}]}
                                             key={node.key}
                                             onclick={() => this.onClickItem(node)}>
                                        <div class="pl-cascade-content">
                                            {node.label}
                                            {!node.isLeaf && (
                                                <div class="pl-cascade-arrow">
                                                    <pl-icon icon="el-icon-arrow-right"/>
                                                </div>
                                            )}
                                        </div>
                                    </pl-item>
                                ))}
                            </pl-list>
                        </pl-scroll>
                    </div>
                ))}
            </div>
        )
    },
    computed: {
        formatData(): CascadeData[] {
            if (!this.checkProps()) return []
            if (!this.p_data) return []

            this.formatCount++
            this.rootData.children = this.p_data.map(item => this.formatNodeData(item, this.formatCount, this.rootData))
            this.rootData.data = {[this.childrenField]: this.p_data}
            return this.rootData.children
        },
        cascadeData(): CascadeData[] {
            const formatData = this.formatData as CascadeData[]
            if (formatData.length === 0) return []
            let expandKeys = []
            if (!!this.expandKeys && this.expandKeys.length > 0) {
                expandKeys = this.expandKeys
            } else if (!!this.p_value && this.p_value.length > 0) {
                expandKeys = this.p_value
            }

            let children = formatData

            let cascadeData = []
            cascadeData.push(children)

            expandKeys.forEach((key: string) => {
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (child.key === key && !child.isLeaf) {
                        children = child.children
                        cascadeData.push(children)
                        break
                    }
                }
            })

            return cascadeData
        },
    },
    methods: {
        /*---------------------------------------methods-------------------------------------------*/

        /*---------------------------------------utils-------------------------------------------*/
        /**
         * 设置标记属性
         * @author  韦胜健
         * @date    2020/3/31 12:20
         */
        setMark(key, attr, value) {
            let mark = this.mark[key]
            if (!mark) {
                mark = new CascadeMark(key)
                this.$set(this.mark, key, mark)
            }
            mark[attr] = value
        },
        /**
         * 获取标记属性
         * @author  韦胜健
         * @date    2020/3/31 14:01
         */
        getMark(key, attr) {
            let mark = this.mark[key]
            if (!mark) {
                mark = new CascadeMark(key)
                this.$set(this.mark, key, mark)
            }
            return mark[attr]
        },
        /**
         * 检查props是否合法
         * @author  韦胜健
         * @date    2020/3/30 18:48
         */
        checkProps() {
            if (!this.keyField) {
                console.error('pl-cascade 的 keyField属性不能为空，每一条记录必须要有一个key标识')
                return false
            }
            if (!this.childrenField) {
                console.error('pl-cascade 的 childrenKey不能为空')
                return false
            }
            return true
        },
        formatNodeData(data, formatCount: number, parent?: CascadeData, level: number = 1): CascadeData {
            const node = new CascadeData(data, this, level, parent)
            this.setMark(node.key, CascadeMark.node, node)
            this.setMark(node.key, CascadeMark.formatCount, formatCount)
            node.children = (node.childrenData || []).map(child => this.formatNodeData(child, formatCount, node, level + 1))
            return node
        },
        /*---------------------------------------handler-------------------------------------------*/
        onClickItem(node: CascadeData) {

            let expandKeys = [node.key]
            let parent = node.parent
            while (!!parent && !!parent.key) {
                expandKeys.unshift(parent.key)
                parent = parent.parent
            }
            this.expandKeys = expandKeys

            if (node.isLeaf) {
                this.p_value = expandKeys
                this.emitInput(expandKeys)
            }
        },
    },
}