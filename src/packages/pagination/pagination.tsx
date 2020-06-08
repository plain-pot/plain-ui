import {computed, defineComponent, ref, watch} from "@vue/composition-api";
import {StyleProps, useStyle} from "@/use/useStyle";
import {EditProps, useEdit} from "@/use/useEdit";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {$plain} from "@/packages/base";
import {useSlots} from "@/use/useSlots";

const SizesWidth = {
    large: 115,
    normal: 100,
    mini: 85,
}

export default defineComponent({
    name: 'pl-pagination',
    props: {
        ...StyleProps,
        ...EditProps,

        pageSize: {type: Number},                                                               // 页大小
        total: {type: Number},                                                                  // 总共条目数
        totalPage: {type: Number},                                                              // 总页数，与 total/pageSize 作用类似，用来确定总页数；
        pagerCount: {type: Number, default: 7},                                                 // 页码按钮数量，当总页数超过时会折叠
        currentPage: {type: Number},                                                            // 当前页
        layout: {type: String, default: 'sizes,jumper,prev,pager,next,loading,blank,total,slot'},       // 组件布局
        pageSizes: {type: Array, default: [10, 20, 50, 100]},                                   // 页大小下拉选项数组
        prevText: {type: String},                                                               // 上一页按钮替换文本
        nextText: {type: String},                                                               // 下一页按钮替换文本

        jumperNumberWidth: {type: Number},                                                      // 跳转页的数字输入框宽度
    },
    setup(props) {

        const {editComputed} = useEdit()
        const {styleComputed} = useStyle()

        const {$slots} = useSlots()

        const {emit} = useEvent({
            jump: EmitFunc,
            prev: EmitFunc,
            next: EmitFunc,
            currentChange: EmitFunc,
            sizeChange: EmitFunc,
        })

        const jumperValue = ref(null as number | null)
        watch(() => props.currentPage, (val) => jumperValue.value = val == null ? 1 : Number(val))

        const classes = computed(() => [
            'pl-pagination',
            `pl-pagination-size-${styleComputed.value.size}`,
            `pl-pagination-shape-${styleComputed.value.shape}`,
            {
                'pl-pagination-disabled': editComputed.value.disabled,
            },
        ])

        const jumperNumberWidth = computed(() => {
            if (!!props.jumperNumberWidth) {
                return props.jumperNumberWidth
            } else {
                return {
                    large: 78,
                    normal: 64,
                    mini: 56,
                }[styleComputed.value.size]
            }
        })

        const totalPageData = computed(() => {
            if (props.totalPage != null) {
                return props.totalPage
            } else if (props.pageSize != null && props.total != null) {
                return Math.ceil(props.total / props.pageSize)
            } else {
                return 0
            }
        })

        const pageInfo = computed(() => {
            let currentPage = Number(props.currentPage)
            let pagerCount = Number(props.pagerCount)
            let totalPage = Number(totalPageData.value)
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
        })

        const pagers = computed(() => {
            const {
                currentPage,
                pagerCount,
                totalPage,
                showPrevMore,
                showNextMore
            } = pageInfo.value

            const array: number[] = []

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
        })

        const utils = {
            /**
             * 获取页码按钮的 class
             * @author  韦胜健
             * @date    2020/3/30 12:07
             */
            getPagerButtonClass(page) {
                return [
                    'pl-pagination-pager-button',
                    {
                        'pl-pagination-pager-button-active': page === pageInfo.value.currentPage
                    },
                ]
            },
            /**
             * 跳转到指定页
             * @author  韦胜健
             * @date    2020/3/30 14:02
             */
            changeCurrent(val) {
                if (!editComputed.value.editable) return;
                emit.currentChange(val)
            },
        }

        const handler = {
            /**
             * 跳转到上一页
             * @author  韦胜健
             * @date    2020/3/30 14:08
             */
            onPrev() {
                if (!editComputed.value.editable) return;
                if (pageInfo.value.currentPage === 1) {
                    return
                }
                utils.changeCurrent(pageInfo.value.currentPage - 1)
                emit.prev()
            },
            /**
             * 跳转到下一页
             * @author  韦胜健
             * @date    2020/3/30 14:09
             */
            onNext() {
                if (!editComputed.value.editable) return;
                if (pageInfo.value.totalPage != null && pageInfo.value.currentPage == pageInfo.value.totalPage) {
                    return
                }
                utils.changeCurrent(pageInfo.value.currentPage + 1)
                emit.next()
            },
            /**
             * 跳转到指定页
             * @author  韦胜健
             * @date    2020/3/30 14:29
             */
            async onJump() {
                if (!editComputed.value.editable) return;
                await $plain.nextTick()
                let val = jumperValue.value
                if (!val && val !== 0) {
                    val = 1
                    await $plain.nextTick()
                    jumperValue.value = val
                }
                emit.jump(val)
            },
        }

        return () => {
            const sizes = (
                <pl-select
                    class="pl-pagination-sizes"
                    value={props.pageSize}

                    loading={false}
                    readonly={editComputed.value.readonly || editComputed.value.loading}
                    filterable={false}
                    inputProps={{width: SizesWidth[styleComputed.value.size], clearIcon: false}}
                    onChange={emit.sizeChange}>
                    {(props.pageSizes || []).map(item => (
                        <pl-select-option label={`${item} 条/页`} val={item} key={item}/>
                    ))}
                </pl-select>
            )

            const jumper = (
                <div class="pl-pagination-jumper">
                    <span>前往</span>
                    <pl-number inputProps={{width: jumperNumberWidth.value}}
                               readonly={editComputed.value.readonly || editComputed.value.loading}
                               hideButton
                               loading={false}
                               value={jumperValue.value}
                               onInput={val => jumperValue.value = val}
                               onEnter={handler.onJump}/>
                    <span>页</span>
                </div>
            )

            const prev = (
                <div class="pl-pagination-prev pl-pagination-pager-button" onClick={handler.onPrev}>
                    {!!props.prevText ? props.prevText : <pl-icon icon="el-icon-arrow-left"/>}
                </div>
            )
            const next = (
                <div class="pl-pagination-next pl-pagination-pager-button" onClick={handler.onNext}>
                    {!!props.nextText ? props.nextText : <pl-icon icon="el-icon-arrow-right"/>}
                </div>
            )

            const pager = (
                <ul class="pl-pagination-pager">
                    {pageInfo.value.totalPage > 0 && <li key="first" class={utils.getPagerButtonClass(1)} onClick={() => utils.changeCurrent(1)}>1</li>}
                    {!!pageInfo.value.showPrevMore && <li key="prev-more" class={utils.getPagerButtonClass('prev')}>
                        <pl-icon icon="el-icon-more"/>
                    </li>}
                    {pagers.value.map((page, index) => <li class={utils.getPagerButtonClass(page)} key={index} onClick={() => utils.changeCurrent(page)}>{page}</li>)}
                    {!!pageInfo.value.showNextMore && <li key="prev-more" class={utils.getPagerButtonClass('next')}>
                        <pl-icon icon="el-icon-more"/>
                    </li>}
                    {pageInfo.value.totalPage > 1 && <li key="last" class={utils.getPagerButtonClass(pageInfo.value.totalPage)} onClick={() => utils.changeCurrent(pageInfo.value.totalPage)}>{pageInfo.value.totalPage}</li>}
                </ul>
            )

            const blank = (<div class="pl-pagination-blank"></div>)
            const total = props.total == null ? null : (<div class="pl-pagination-total"><span>总共 {props.total} 条记录</span></div>)
            const slot = !$slots.default ? null : (<div class="pl-pagination-slot">{$slots.default}</div>)
            const loading = !editComputed.value.loading ? null : (
                <div class="pl-pagination-loading">
                    <pl-loading type="beta"/>
                </div>
            )

            let parts = {sizes, jumper, prev, pager, next, loading, blank, total, slot,}

            let layout = props.layout.replace(/\s+/g, '').split(',').reduce((ret: any[], item) => {
                let part = parts[item]
                if (!!part) {
                    ret.push(part)
                }
                return ret
            }, [])

            return (
                <div class={classes.value}>
                    {layout}
                </div>
            )
        }
    },
})