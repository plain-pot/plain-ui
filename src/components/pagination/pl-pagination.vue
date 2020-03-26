<script>
    import {EditMixin, EmitMixin, StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-pagination",
        mixins: [
            StyleMixin,
            EditMixin,
            EmitMixin,
        ],
        props: {
            pageSize: {type: Number},                                                   // 页大小
            total: {type: Number},                                                      // 总共条目数
            pagerCount: {type: Number},                                                 // 页码按钮数量，当总页数超过时会折叠
            currentPage: {type: Number},                                                // 当前页
            layout: {type: String, default: 'sizes,prev,pager,next,jumper,total,slot'}, // 组件布局
            pageSizes: {type: Array, default: [10, 20, 50, 100]},                       // 页大小下拉选项数组
            prevText: {type: String},                                                   // 上一页按钮替换文本
            nextText: {type: String},                                                   // 下一页按钮替换文本
            disabled: {type: Boolean}                                                   // 是否禁用
        },
        render() {

            const sizes = (<pl-select
                value={this.pageSize}
                data={this.formatPageSizes}
                labelKey="name"
                valueKey="val"
                filterable={false}
                inputProps={{width: 100, clearIcon: false}}/>)

            let layout = [sizes]

            return (
                <div class="pl-pagination">
                    {layout}
                </div>
            )
        },
        data() {
            return {}
        },
        computed: {
            formatPageSizes() {
                return (this.pageSizes || []).reduce((ret, item) => {
                    ret.push({
                        name: `${item}条/页`,
                        val: item,
                    })
                    return ret
                }, [])
            },
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>