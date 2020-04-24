import {RefsMixinFactory} from "../../../utils/mixins";
import virtualList from '../../virtual-list/pl-virtual-list.vue'

const VirtualList = virtualList as any

export default {
    name: 'pl-virtual-table',
    props: {
        data: {type: Array},                                        // 列表数据
        summaryData: {type: Array},                                 // 合计行数据

        size: {type: Number},                                       // 行高
        width: {type: Number},                                      // 表格总宽度

        remain: {type: Number},
        dynamicSize: {type: Number},

        scrollProps: {type: Object},
    },
    mixins: [
        VirtualList,
        RefsMixinFactory({
            scroll: Object,
        })
    ],
    data() {

        const disabledQueenAnimation = this.$plain.utils.debounce(() => this.virtualTable.scrollFlag = false, 300)
        return {
            virtualTable: {
                scrollFlag: false,
                disabledQueenAnimation,
                scrollLeft: 0,
            },
        }
    },
    created() {
        this.$on('scroll', this.onVirtualTableScroll)
    },
    beforeDestroy() {
        this.$off('scroll', this.onVirtualTableScroll)
    },
    render(h) {
        return (
            <div class={[...this.classes, 'pl-virtual-table']}>
                <pl-scroll ref="scroll" onScroll={this.onScroll} scrollX={true} {...{props: this.scrollProps}}>
                    <div class="pl-virtual-list-strut" style={{...this.strutStyles, width: `${this.width}px`}}>
                        <div class="pl-virtual-list-content" style={this.contentStyles}>
                            <pl-list tag="table"
                                     disabled={!this.isDisabled && this.virtualTable.scrollFlag}
                                     cellspacing={0}
                                     cellpadding={0}
                                     border={0}
                                     style={this.tableStyles}>
                                {this.targetData.map(({item, index}) => !this.$scopedSlots.default ? null : this.$scopedSlots.default({item, index}))}
                            </pl-list>
                        </div>
                    </div>
                </pl-scroll>
                {!!this.summaryData && (
                    <table class="pl-virtual-table-summary-table"
                           style={this.summaryTableStyles}
                           cellspacing={0}
                           cellpadding={0}
                           border={0}
                    >
                        {this.summaryData.map((item, index) => !this.$scopedSlots.default ? null : this.$scopedSlots.default({item, index}))}
                    </table>
                )}
            </div>
        )
    },
    computed: {
        tableStyles() {
            return {
                width: `${this.width}px`,
                paddingBottom: '14px',
            }
        },
        summaryTableStyles() {
            return {
                ...this.tableStyles,
                left: `${-this.virtualTable.scrollLeft}px`,
                height: `${this.summaryData.length * this.size}px`
            }
        },
        strutStyles() {
            if (this.isDisabled) return
            const dataHeight = (this.data || []).length * this.size
            const summaryHeight = (!!this.summaryData && this.summaryData.length > 0) ? (this.summaryData || []).length * this.size : 0

            return {
                height: `${dataHeight + summaryHeight + 14}px`
            }
        },
        contentStyles() {
            if (this.isDisabled) return
            const summaryHeight = (this.summaryData || []).length * this.size

            return {
                transform: `translate3d(0,${this.offset}px,0)`,
                paddingBottom: `${summaryHeight}px`,
            }
        },
    },
    methods: {
        onVirtualTableScroll(e) {
            this.virtualTable.scrollFlag = true
            this.virtualTable.disabledQueenAnimation()

            this.virtualTable.scrollLeft = e.currentTarget.scrollLeft
        },
    },

}