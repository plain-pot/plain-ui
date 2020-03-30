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
            totalPage: {type: Number},                                                              // 总页数，与 total/pageSize 作用类似，用来确定总页数；
            pagerCount: {type: Number, default: 7},                                                 // 页码按钮数量，当总页数超过时会折叠
            currentPage: {type: Number},                                                            // 当前页
            layout: {type: String, default: 'sizes,prev,pager,next,jumper,blank,total,slot'},       // 组件布局
            pageSizes: {type: Array, default: [10, 20, 50, 100]},                                   // 页大小下拉选项数组
            prevText: {type: String},                                                               // 上一页按钮替换文本
            nextText: {type: String},                                                               // 下一页按钮替换文本
            disabled: {type: Boolean},                                                              // 是否禁用

            jumperNumberWidth: {type: Number},                                                      // 跳转页的数字输入框宽度
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
                    <pl-number inputProps={{width: this.p_jumperNumberWidth}} hideButton value={this.jumperValue} onInput={val => this.jumperValue = val}/>
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
                    {this.pageInfo.totalPage > 0 && <li key="first" class={this.getPagerButtonClass(1)}>1</li>}
                    {!!this.pageInfo.showPrevMore && <li key="prev-more" class={this.getPagerButtonClass('prev')}>
                        <pl-icon icon="el-icon-more"/>
                    </li>}
                    {this.pagers.map((page, index) => <li class={this.getPagerButtonClass(page)} key={index}>{page}</li>)}
                    {!!this.pageInfo.showNextMore && <li key="prev-more" class={this.getPagerButtonClass('next')}>
                        <pl-icon icon="el-icon-more"/>
                    </li>}
                    {this.pageInfo.totalPage > 1 && <li key="last" class={this.getPagerButtonClass(this.pageInfo.totalPage)}>{this.pageInfo.totalPage}</li>}
                </ul>
            )

            const blank = (<div class="pl-pagination-blank"></div>)
            const total = this.total == null ? null : (<div className="pl-pagination-total"><span>总共 {this.total} 条记录</span></div>)
            const slot = !this.$slots.default ? null : (<div class="pl-pagination-slot">{this.$slots.default}</div>)
            const loading = (<div class="pl-pagination-loading">
                <pl-loading type="beta"/>
            </div>)

            let layout = [sizes, jumper, prev, pager, next, loading, blank, total, slot].filter(item => !!item)

            return (
                <div class={this.classes}>
                    {layout}
                </div>
            )
        },
        data() {
            return {
                // 跳转页输入框绑定值
                jumperValue: 1,
            }
        },
        computed: {
            /**
             * 根节点class
             * @author  韦胜健
             * @date    2020/3/30 9:48
             */
            classes() {
                return [
                    'pl-pagination',
                    `pl-pagination-size-${this.p_size || 'normal'}`,
                    `pl-pagination-shape-${this.p_shape || 'fillet'}`,
                ]
            },
            /**
             * 格式化页大小显示文本
             * @author  韦胜健
             * @date    2020/3/30 9:48
             */
            formatPageSizes() {
                return (this.pageSizes || []).reduce((ret, item) => {
                    ret.push({
                        name: `${item}条/页`,
                        val: item,
                    })
                    return ret
                }, [])
            },
            /**
             * 跳转页输入框宽度
             * @author  韦胜健
             * @date    2020/3/30 12:07
             */
            p_jumperNumberWidth() {
                if (!!this.jumperNumberWidth) {
                    return this.jumperNumberWidth
                } else {
                    return {
                        large: 78,
                        normal: 64,
                        mini: 56,
                    }[this.p_size || 'normal']
                }
            },
            /**
             * 总页数
             * @author  韦胜健
             * @date    2020/3/30 9:48
             */
            p_totalPage() {
                if (this.totalPage != null) {
                    return this.totalPage
                } else if (this.pageSize != null && this.total != null) {
                    return Math.ceil(this.total / this.pageSize)
                } else {
                    return 0
                }
            },
            /**
             * 分页信息
             * @author  韦胜健
             * @date    2020/3/30 12:07
             */
            pageInfo() {
                let currentPage = Number(this.currentPage)
                let pagerCount = Number(this.pagerCount)
                let totalPage = Number(this.p_totalPage)
                const midPagerCount = (pagerCount - 1) / 2                      // 从0开始计算中间索引

                let showPrevMore = false
                let showNextMore = false

                if (totalPage > pagerCount) {
                    if (currentPage > pagerCount - midPagerCount) {
                        showPrevMore = true
                    }
                    if (currentPage < totalPage - midPagerCount) {
                        showNextMore = true
                    }
                }

                return {
                    currentPage,                // 当前页
                    pagerCount,                 // 页码按钮数量，包括左折叠左边的一个按钮以及右折叠右边的一个按钮
                    totalPage,                  // 总页数
                    midPagerCount,              // 中间页码按钮位置索引
                    showPrevMore,               // 是否显示左折叠
                    showNextMore,               // 是否显示右折叠
                }
            },
            /**
             * 页码按钮
             * @author  韦胜健
             * @date    2020/3/30 9:48
             */
            pagers() {
                const {
                    currentPage,
                    pagerCount,
                    totalPage,
                    showPrevMore,
                    showNextMore
                } = this.pageInfo

                const array = []

                if (showPrevMore && !showNextMore) {
                    const startPage = totalPage - (pagerCount - 2);
                    for (let i = startPage; i < totalPage; i++) {
                        array.push(i);
                    }
                } else if (!showPrevMore && showNextMore) {
                    for (let i = 2; i < pagerCount; i++) {
                        array.push(i);
                    }
                } else if (showPrevMore && showNextMore) {
                    const offset = Math.floor(pagerCount / 2) - 1;
                    for (let i = currentPage - offset; i <= currentPage + offset; i++) {
                        array.push(i);
                    }
                } else {
                    for (let i = 2; i < totalPage; i++) {
                        array.push(i);
                    }
                }

                return array
            },
        },
        methods: {
            /**
             * 获取页码按钮的 class
             * @author  韦胜健
             * @date    2020/3/30 12:07
             */
            getPagerButtonClass(page) {
                return [
                    'pl-pagination-pager-button',
                    {
                        'pl-pagination-pager-button-active': page === this.pageInfo.currentPage
                    },
                ]
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-pagination {

            display: flex;
            align-items: center;
            color: $itc;
            width: 100%;

            .pl-icon {
                color: $icc;
            }

            & > * {
                display: inline-block;
            }

            .pl-number {
                padding: 0 8px;

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
                border: solid 1px $ibc;

                &:hover {
                    background-color: mix(white, $colorPrimary, 90%);
                }

                &:active {
                    background-color: mix(white, $colorPrimary, 75%);
                }

                &.pl-pagination-pager-button-active {
                    background-color: $colorPrimary;
                    border-color: $colorPrimary;
                    color: white;
                }
            }

            .pl-pagination-pager-button, .pl-pagination-pager {
                & + .pl-pagination-pager-button, & + .pl-pagination-pager {
                    margin-left: 8px;
                }
            }

            .pl-pagination-blank {
                flex: 1;
            }

            .pl-pagination-total, .pl-pagination-loading {
                padding: 0 12px;
            }

            @include sizeMixin(pagination) {
                .pl-pagination-pager, .pl-pagination-prev, .pl-pagination-next, .pl-pagination-blank, .pl-pagination-pager-button {
                    height: $value;
                    line-height: $value;

                    &.pl-pagination-pager-button {
                        min-width: $value;
                    }
                }
                &.pl-pagination-size-large {
                    font-size: 16px;
                }
                &.pl-pagination-size-normal {
                    font-size: 14px;
                }
                &.pl-pagination-size-mini {
                    font-size: 12px;
                }
            }

            @include shapeMixin(pagination) {
                .pl-pagination-pager-button {
                    border-radius: $value;
                }
            }
        }
    }
</style>