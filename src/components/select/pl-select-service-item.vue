<script>
    import {RefsMixinFactory} from "../../utils/mixins";
    import {decodeSelectData} from "./SelectUtils";

    export default {
        name: "pl-select-service-item",
        inject: ['selectController'],
        mixins: [RefsMixinFactory({
            items: null,
            popover: null,
        })],
        data() {
            return {
                /*响应键盘事件*/
                keyboardEventOption: {
                    down: () => {
                        this.next()
                    },
                    up: () => {
                        this.prev()
                    },
                    esc: () => {
                        this.hide()
                    },
                    enter: () => {
                        this.selectCurrentItem()
                    },
                },
                /*当前是否显示*/
                showFlag: false,
                /*当前是否已经关闭*/
                openFlag: false,
                /*当前选择的对象及其参数*/
                select: null,
                /*当前高亮的索引*/
                highlightIndex: null,
                /*打开之前，得到焦点的激活元素*/
                activeElement: null,
                /*是否为第一次使用键盘*/
                firstKeyboardFlag: null,
            }
        },
        computed: {
            /*当前渲染的列表数组*/
            list() {
                let data = this.$plain.utils.typeOf(this.select.opt.data) === 'function' ? this.select.opt.data() : this.select.opt.data;
                data = data || [];
                return data.map(item => {

                    let decodeData = decodeSelectData(item, this.select.opt)
                    const value = decodeData.value

                    let optValue = this.$plain.utils.typeOf(this.select.opt.value) === 'function' ? this.select.opt.value() : this.select.opt.value
                    decodeData.active = this.$plain.utils.typeOf(optValue) === 'array' ? optValue.indexOf(value) > -1 : optValue == value
                    decodeData.data = item
                    // console.log(decodeData)
                    return decodeData
                })
            },
            /*当前service item是否为私有实例*/
            private() {
                if (!this.select) return false
                if (!this.select.opt.private) return false
                return true
            },
            isShow() {
                return this.showFlag
            },
            isOpen() {
                return this.openFlag
            },
        },
        created() {
            this.selectController.addItem(this)
        },
        beforeDestroy() {
            this.selectController.removeItem(this)
        },
        render(h) {
            if (!this.select) return null
            return (
                <pl-popover
                    ref="popover"
                    class="pl-select-service-item"
                    v-model={this.showFlag}
                    open={this.openFlag}
                    trigger="manual"
                    reference={this.select.opt.reference}
                    private={String(this.private)}

                    {...{
                        props: this.select.opt.popoverProps,
                        on: {
                            'update:open': val => this.openFlag = val,
                            show: this.onShow,
                            hide: this.onHide,
                            open: this.onOpen,
                            close: this.onClose,
                            'click-body': this.onClickBody,
                            'click-popper': this.onClickPopper,
                            'click-popper-content': this.onClickPopperContent,
                            'mousedown-popper': this.onMousedownPopper,
                        },
                    }}>
                    <div class="pl-select-service-item-content" slot="popper">
                        <ul class="pl-select-list">
                            {
                                this.list.length > 0 ?
                                    this.list.map((item, index) => (
                                        <li ref="items"
                                            refInFor={true}
                                            key={index}
                                            class={
                                                [
                                                    'pl-select-item',
                                                    {
                                                        'pl-select-item-active': item.active,
                                                        'pl-select-item-highlight': this.highlightIndex === index,
                                                        'pl-select-item-disabled': item.disabled === true,
                                                        'pl-select-item-group': item.group === true,
                                                    }
                                                ]
                                            }
                                            onClick={(e) => this.onClickItem(item, index, e)}
                                            onMousedown={() => this.onItemMousedown(item, index)}>
                                            {!!item.icon && <pl-icon icon={item.icon}/>}
                                            {!!this.select.opt.render ? this.select.opt.render(h, item, index) : item.label}
                                        </li>
                                    ))
                                    :
                                    <li class="pl-select-item pl-select-item-no-data-text">
                                        <pl-icon icon="el-icon-reading"/>
                                        {!this.select.opt.noDataText ? '暂无数据' : this.$plain.utils.typeOf(this.select.opt.noDataText) === 'function' ? this.select.opt.noDataText() : this.select.opt.noDataText}
                                    </li>
                            }
                        </ul>
                    </div>
                </pl-popover>
            )
        },
        methods: {
            /**
             * 绑定select
             * @author  韦胜健
             * @date    2020-01-24 17:30
             * @param   select                          select对象实例，在controller中定义
             */
            bind(select) {
                if (!!this.select) {
                    this.select.ins = null
                }
                this.select = select
                select.ins = this
            },
            /**
             * 解绑select对象
             * @author  韦胜健
             * @date    2020/3/20 17:37
             */
            unbind(select) {
                if (select === this.select) {
                    this.select = null
                }
                select.ins = null
            },
            /**
             * 打开下拉
             * @author  韦胜健
             * @date    2020-01-24 17:31
             */
            async show() {
                if (!!this.showFlag) return

                if (!!this.select.opt.beforeShow) await this.select.opt.beforeShow()

                this.showFlag = true
                this.firstKeyboardFlag = true
                this.highlightIndex = null

                /*设置 RefsMixinFactory为当前选中的行*/
                for (let i = 0; i < this.list.length; i++) {
                    const item = this.list[i];
                    if (!!item.active) {
                        this.highlightIndex = i
                        break
                    }
                }
            },
            /**
             * 关闭下拉
             * @author  韦胜健
             * @date    2020-01-24 17:31
             */
            async hide() {
                if (!this.showFlag) return
                if (!!this.select.opt.beforeHide) await this.select.opt.beforeHide()
                this.showFlag = false
            },
            /**
             * 高亮上一个元素
             * @author  韦胜健
             * @date    2020-01-24 17:31
             */
            prev() {
                if (this.list.length === 0) return;
                if (!!this.firstKeyboardFlag) {
                    this.firstKeyboardFlag = false
                    this.highlightIndex = 0
                }
                if (this.highlightIndex > 0) {
                    this.highlightIndex--
                    const item = this.items[this.highlightIndex]
                    const {p_wrapperScrollTop} = this.popover.$refs.scroll
                    if (p_wrapperScrollTop > item.offsetTop) {
                        this.popover.$refs.scroll.scrollTop(item.offsetTop, 25)
                    }
                } else {
                    this.highlightIndex = this.list.length - 1
                    this.popover.$refs.scroll.scrollTop(this.items[this.highlightIndex].offsetTop, 25)
                }
            },
            /**
             * 高亮下一个元素
             * @author  韦胜健
             * @date    2020-01-24 17:31
             */
            next() {
                if (this.list.length === 0) return;
                if (!!this.firstKeyboardFlag) {
                    this.firstKeyboardFlag = false
                    this.highlightIndex = 0
                    return
                }
                if (this.highlightIndex < (this.list.length - 1)) {
                    this.highlightIndex++
                    const item = this.items[this.highlightIndex]
                    const {hostHeight, p_wrapperScrollTop} = this.popover.$refs.scroll

                    const scrollTop = item.offsetTop + item.offsetHeight - hostHeight
                    if (scrollTop > 0 && scrollTop > p_wrapperScrollTop) {
                        this.popover.$refs.scroll.scrollTop(scrollTop, 25)
                    }
                } else {
                    this.highlightIndex = 0
                    this.popover.$refs.scroll.scrollTop(0, 25)
                }
            },
            /**
             * 选中当前高亮行
             * @author  韦胜健
             * @date    2020-01-23 13:01
             */
            selectCurrentItem() {
                let index = (this.highlightIndex == null || this.list[this.highlightIndex] == null) ? 0 : this.highlightIndex
                if (this.list[this.highlightIndex] == null) return

                this.onClickItem(this.list[index], index)
            },
            /*---------------------------------------handler-------------------------------------------*/
            /**
             * 处理点击下拉选项
             * @author  韦胜健
             * @date    2020-01-24 17:31
             */
            onClickItem(item, index, e) {
                if (e.currentTarget !== e.target) return;
                if (item.disabled === true || item.group === true) return
                !!this.select.opt.onClick && this.select.opt.onClick(item, index)
                this.highlightIndex = index
                if (!!this.select.opt.autoClose) this.hide()
            },
            /**
             * 处理点击除了reference以及popper内容的动作
             * @author  韦胜健
             * @date    2020-01-24 17:32
             */
            onClickBody() {
                if (!this.isShow) return

                if (!!this.select.opt.onClickBody) {
                    this.select.opt.onClickBody()
                }
                if (!!this.select.opt.closeAfterBody) {
                    this.hide()
                }
            },
            onClickPopper() {
                if (!!this.select.opt.onClickPopper) {
                    this.select.opt.onClickPopper()
                }
            },
            onClickPopperContent() {
                if (!!this.select.opt.onClickPopperContent) {
                    this.select.opt.onClickPopperContent()
                }
            },
            onMousedownPopper() {
                if (!!this.select.opt.onMousedownPopper) {
                    this.select.opt.onMousedownPopper()
                }
            },
            /**
             *
             * @author  韦胜健
             * @date    2020-01-26 19:37
             */
            onItemMousedown(...args) {
                if (!!this.select.opt.onItemMousedown) {
                    this.select.opt.onItemMousedown(...args)
                }
            },
            /**
             * 处理打开刚开始事件
             * @author  韦胜健
             * @date    2020-01-24 17:34
             */
            onShow() {
                if (!!this.select.opt.onShow) this.select.opt.onShow()

                if (!!this.select.opt.keyboard) {
                    this.$plain.$keyboard.listen(this.keyboardEventOption)
                }
            },
            /**
             * 处理关闭刚开始事件
             * @author  韦胜健
             * @date    2020-01-24 17:34
             */
            onHide() {
                if (!!this.select.opt.onHide) this.select.opt.onHide()

                if (!!this.select.opt.keyboard) {
                    this.$plain.$keyboard.unbindListener(this.keyboardEventOption)
                    /*如果当前没有激活元素，并且打开之前有激活的元素，则让旧的激活元素重新激活*/
                    if (!!this.activeElement && document.activeElement === document.body) {
                        this.activeElement.focus()
                    }
                }
            },
            /**
             * 处理打开结束事件
             * @author  韦胜健
             * @date    2020-01-24 17:34
             */
            onOpen() {
                if (!!this.select.opt.onOpen) this.select.opt.onOpen()

                if (!!this.select.opt.keyboard) {
                    /*保留当前获取焦点的元素，等关闭之后重新设置该元素获取焦点*/
                    this.activeElement = this.$plain.$keyboard.cancelActiveElement()
                }
            },
            /**
             * 处理关闭结束事件
             * @author  韦胜健
             * @date    2020-01-24 17:34
             */
            onClose() {
                if (!!this.select.opt.onClose) this.select.opt.onClose()
            },
        },
    }
</script>

<style lang="scss">
</style>