<template>
    <div class="pl-date-year-panel">
        <pl-scroll ref="scrollbar"
                   fit-host-width
                   @vertical-scroll-top="p_addPreviousYears"
                   @vertical-scroll-bottom="p_addNextYears">
            <div class="pl-date-year-panel-content">
                <div class="pl-date-year-panel-item-wrapper" v-for="(item,index) in list" :key="index">
                    <div class="pl-date-year-panel-item"
                         ref="items"
                         :class="{
                            'pl-date-year-panel-item-active':item === currentYear,
                            'pl-date-year-panel-item-pick-year':item === p_value,
                            'pl-date-year-panel-item-now':nowYear===item,
                            'pl-date-year-panel-item-disabled':(!!maxYear && item>maxYear) || (!!minyear && item<minyear),
                         }"
                         @click="p_clickItem(item,index)">
                        {{item}}
                    </div>
                </div>
            </div>
        </pl-scroll>
    </div>
</template>

<script>
    import {ValueMixin} from "../../mixin/component-mixin";
    import PlScroll from "../pl-scroll";

    export default {
        name: "pl-date-year-panel",
        components: {PlScroll},
        mixins: [ValueMixin],
        props: {
            currentYear: {},

            nowYear: {},                                    //当前年份
            maxDate: {},
            minDate: {},
        },
        data() {
            return {
                p_watchCurrentValue: false,             //不监听currentValue变化事件
                list: [],                               //年份数组
                num: 15,                                //每一页显示的个数
                start: null,                            //档期年份数组的起始年份
            }
        },
        computed: {
            currentIndex() {
                return this.list.indexOf(this.p_value)
            },
            maxYear() {
                return !!this.maxDate ? this.maxDate.getFullYear() : null
            },
            minyear() {
                return !!this.minDate ? this.minDate.getFullYear() : null
            },
        },
        async created() {
            this.reset()
            await this.$plain.$utils.delay()
            this.updatePosition()
        },
        methods: {
            /*
             *  重新计算年份数组
             *  @author     martsforever
             *  @datetime   2019/3/4 22:32
             */
            reset() {
                this.list = []
                this.start = this.value - Math.floor(this.num * 1.5)
                for (let i = this.start; i < this.start + this.num * 3; i++) this.list.push(i)
                this.$nextTick(() => this.p_value = this.value)
                this.p_emitValue()
            },
            /*
             *  更新滚动条位置，
             *  @author     martsforever
             *  @datetime   2019/3/4 22:32
             */
            updatePosition() {
                this.$nextTick(() => {
                    const targetItemRef = this.$refs.items[this.currentIndex - 6]
                    !!targetItemRef && this.$refs.scrollbar.scrollTop(targetItemRef.offsetTop)
                })
            },
            /*
             *  滚动到顶部时，年份数组栈顶部添加额外年份
             *  @author     martsforever
             *  @datetime   2019/3/4 22:42
             */
            p_addPreviousYears() {
                let currentScrolllTop = this.$refs.scrollbar.contentWrapperScrollTop
                const newStart = this.start - this.num
                for (let i = this.start - 1; i >= newStart; i--) {
                    this.list.unshift(i)
                }
                this.start = newStart
                this.$nextTick(() => {
                    this.$refs.scrollbar.$refs.wrapper.scrollTop = currentScrolllTop + this.$el.offsetHeight
                })
            },
            /*
             *  滚动到底部时，年份数组栈尾部添加额外年份
             *  @author     martsforever
             *  @datetime   2019/3/4 22:42
             */
            p_addNextYears() {
                let addStart = this.list[this.list.length - 1]
                for (let i = 0; i < this.num; i++) {
                    this.list.push(++addStart)
                }
            },
            /*
             *  处理年份点击事件
             *  @author     martsforever
             *  @datetime   2019/3/4 22:34
             */
            p_clickItem(item) {
                if ((!!this.maxYear && item > this.maxYear) || (!!this.minyear && item < this.minyear)) return
                this.p_value = item
                this.$emit('click', item)
                this.p_emitValue()
            },
        },

    }
</script>