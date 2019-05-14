const TreeMixin = {
    props: {
        data: {type: Array, default: () => []},                                 //渲染的数据
        labelKey: {type: String, required: true},                               //显示的文本key
        childrenKey: {type: String, required: true},                            //子树渲染数据的key
        checkKey: {type: String},                                               //节点是否选中绑定的key
        width: {type: Number, default: 300},                                    //树每个节点的宽度
        scrollX: {type: Boolean},
        autoClose: {type: Boolean},                                             //打开节点之后是否关闭兄弟节点
        emptyText: {type: String, default: '无'},                               //无内容时显示的文本
        toggleOnClickContent: {type: Boolean, default: true},                   //是否点击节点内容的时候打开|关闭节点
        initializedAfterOpen: {type: Boolean, default: true},                   //是否在打开的时候才初始化内容
        checkbox: {type: Boolean, default: false},                              //是否展示复选框
    },
    computed: {
        styles() {
            return {
                width: this.$plain.$utils.unit(this.width)
            }
        },
    },
    methods: {
        /*
        *  触发树节点打开关闭动作
        *  @author     martsforever
        *  @datetime   2019/2/13 23:05
        */
        async p_childToggle(child) {
            await this.$plain.nextTick()
            if (!this.autoClose) return
            if (child.p_open) {
                this.$refs.nodes.forEach(item => {
                    if (item === child) return
                    if (item.p_open) item.close()
                })
            }
        },

        /*---------------------------------------以下为复选框所需要使用的函数-------------------------------------------*/
        /*
        *  设置data中的checkKey选中状态
        *  @author     martsforever
        *  @datetime   2019/2/14 21:31
        */
        p_setDataCheck(data, check = false) {
            !!data && this.checkKey && this.$set(data, this.checkKey, check)
        },
        /*
         *  data是否有子节点数据
         *  @author     martsforever
         *  @datetime   2019/2/14 21:39
         */
        p_dataHasChildren(data) {
            return !!data && this.childrenKey && !!data[this.childrenKey] && data[this.childrenKey].length > 0
        },
        /*
         *  递归修改节点及其子节点的check状态
         *  @author     martsforever
         *  @datetime   2019/2/14 21:43
         */
        p_changeChildrenDataCheck(data, check = false) {
            this.p_setDataCheck(data, check)
            if (this.p_dataHasChildren(data)) data[this.childrenKey].forEach(itemData => this.p_changeChildrenDataCheck(itemData, check))
        },
        /*
         *  根据data的checkKey及其子checkKey判断data节点当前checkbox的显示状态
         *  @author     martsforever
         *  @datetime   2019/2/14 21:54
         */
        p_getStatusFromData(data) {
            /*没有子节点*/
            if (!this.p_dataHasChildren(data)) return data[this.checkKey] ? 'all' : 'none'
            /*有子节点*/
            if (data[this.childrenKey].every(itemData => this.p_getStatusFromData(itemData) === 'all')) return 'all'
            if (data[this.childrenKey].some(itemData => this.p_getStatusFromData(itemData) !== 'none')) return 'some'
            return 'none'
        },
    },
}

export {
    TreeMixin
}