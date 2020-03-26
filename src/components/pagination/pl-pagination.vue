<script>
    import {EditMixin, EmitMixin, StyleMixin} from "../../utils/mixins";

    const SizesWidth = {
        large: 115,
        normal: 100,
        mini: 85,
    }

    export default {
        name: "pl-pagination",
        mixins: [
            StyleMixin,
            EditMixin,
            EmitMixin,
        ],
        props: {
            pageSize: {type: Number},                                                               // 页大小
            total: {type: Number},                                                                  // 总共条目数
            pagerCount: {type: Number},                                                             // 页码按钮数量，当总页数超过时会折叠
            currentPage: {type: Number},                                                            // 当前页
            layout: {type: String, default: 'sizes,prev,pager,next,jumper,blank,total,slot'},       // 组件布局
            pageSizes: {type: Array, default: [10, 20, 50, 100]},                                   // 页大小下拉选项数组
            prevText: {type: String},                                                               // 上一页按钮替换文本
            nextText: {type: String},                                                               // 下一页按钮替换文本
            disabled: {type: Boolean}                                                               // 是否禁用
        },
        render() {

            const sizes = (
                <pl-select
                    class="pl-pagination-sizes"
                    value={this.pageSize}
                    data={this.formatPageSizes}
                    labelKey="name"
                    valueKey="val"
                    filterable={false}
                    inputProps={{width: SizesWidth[this.p_size || 'normal'], clearIcon: false}}/>)

            const jumper = (
                <div class="pl-pagination-jumper">
                    <span>前往</span>
                    <pl-number inputProps={{width: 64}} hideButton value={this.jumperValue} onInput={val => this.jumperValue = val}/>
                    <span>页</span>
                </div>
            )

            const prev = (
                <div class="pl-pagination-prev pl-pagination-pager-button">
                    <pl-icon icon="el-icon-arrow-left"/>
                </div>
            )
            const next = (
                <div class="pl-pagination-next pl-pagination-pager-button">
                    <pl-icon icon="el-icon-arrow-right"/>
                </div>
            )

            const pager = (
                <ul class="pl-pagination-pager">
                    <li class="pl-pagination-pager-button">1</li>
                    <li class="pl-pagination-pager-button">2</li>
                    <li class="pl-pagination-pager-button">3</li>
                    <li class="pl-pagination-pager-button">4</li>
                </ul>
            )

            const blank = (
                <div class="pl-pagination-blank"></div>
            )

            const total = (
                <div class="pl-pagination-total">
                    <span>总共 {this.total} 条记录</span>
                </div>
            )

            const slot = !this.$slots.default ? null : (
                <div class="pl-pagination-slot">
                    {this.$slots.default}
                </div>
            )

            const loading = (
                <div class="pl-pagination-loading">
                    <pl-loading type="beta"/>
                </div>
            )

            const divider = (
                <div class="pl-pagination-divider"></div>
            )

            let layout = [sizes, divider, jumper, divider, prev, next, pager, loading, blank, total, slot].filter(item => !!item)

            return (
                <div class={this.classes}>
                    {layout}
                </div>
            )
        },
        data() {
            return {
                jumperValue: 1,
            }
        },
        computed: {
            classes() {
                return [
                    'pl-pagination',
                    `pl-pagination-size-${this.p_size || 'normal'}`,
                    `pl-pagination-shape-${this.p_shape || 'fillet'}`,
                ]
            },
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
    @include themify {
        .pl-pagination {

            border: solid 1px $ibc;
            display: flex;
            align-items: center;
            color: $itc;
            padding: 0 1px;
            width: 100%;

            .pl-icon{
                color: $icc;
            }

            & > * {
                margin: 1px 0;
                display: inline-block;
            }

            .pl-input {
                .pl-input-inner {
                    border-color: transparent;
                }
            }

            .pl-number {
                input {
                    text-align: center;
                }
            }

            .pl-pagination-jumper {
                padding: 0 12px;
            }

            .pl-pagination-pager {
                margin: 0;
                padding: 0;
                list-style: none;
                display: flex;
                align-items: center;
            }

            .pl-pagination-pager-button {
                text-align: center;
                cursor: pointer;
                transition: all 300ms $transition;
                user-select: none;
                border-radius: 100px;

                &:hover {
                    background-color: mix(white, $colorPrimary, 90%);
                }

                &:active {
                    background-color: mix(white, $colorPrimary, 75%);
                }
            }

            .pl-pagination-blank {
                flex: 1;
            }

            .pl-pagination-total, .pl-pagination-loading {
                padding: 0 12px;
            }

            .pl-pagination-divider {
                width: 1px;
                height: 16px;
                background-color: $ibc;
                content: '';
                margin: 0 12px;
            }

            @include sizeMixin(pagination) {
                .pl-pagination-pager, .pl-pagination-prev, .pl-pagination-next, .pl-pagination-blank, .pl-pagination-pager-button {
                    height: $value;
                    line-height: $value;

                    &.pl-pagination-pager-button {
                        min-width: $value;
                    }
                }
            }

            @include shapeMixin(pagination) {
                border-radius: $value;
            }
        }
    }
</style>