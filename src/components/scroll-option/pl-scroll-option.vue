<template>
    <div class="pl-scroll-option" :style="styles" :class="{'pl-scroll-option-shadow':shadow}">
        <div class="pl-scroll-option-wrapper" @scroll="p_scroll" ref="wrapper" @mousewheel="p_mousewheel">
            <pl-scroll-option-item v-for="(item) in externalData" :key="`top_${item}`"/>
            <pl-scroll-option-item
                    v-for="(item,index) in data"
                    :key="index"
                    v-bind="{
                        labelKey:labelKey,
                        valueKey:valueKey,
                        disabledKey:disabledKey,
                        itemNum:itemNum,
                        itemHeight:itemHeight,
                        index:index,
                        currentIndex:p_index,
                        itemData:item,
                        scrollTop:scrollTop,
                    }"
                    @click="p_click(item,index)">
                {{!!labelKey ? item[labelKey] : item}}
            </pl-scroll-option-item>
            <pl-scroll-option-item v-for="(item) in externalData" :key="`bottom_${item}`"/>
        </div>
        <div class="pl-scroll-option-shadow-top" :style="{height:`${itemNum*itemHeight}px`}"></div>
        <div class="pl-scroll-option-shadow-bottom" :style="{height:`${itemNum*itemHeight}px`}"></div>
    </div>
</template>

<script>

    import PlScrollOptionItem from "./pl-scroll-option-item";

    const scroll = require('scroll');

    export default {
        name: "pl-scroll-option",
        components: {PlScrollOptionItem},
        props: {
            value: {},
            data: {type: Array, required: true},
            labelKey: {type: String},
            valueKey: {type: String},
            disabledKey: {type: String},
            itemHeight: {type: Number, default: 24},
            itemNum: {type: Number, default: 3},
            width: {type: Number, default: 100},
            shadow: {type: Boolean, default: true},
        },
        data() {
            return {
                p_value: this.value,
                scrollTop: 0,
                timer: null,
                p_index: 0,
            }
        },
        watch: {
            value(val) {
                if (val !== this.p_value) {
                    this.p_updateByValue()
                }
            },
        },
        async mounted() {
            if (this.value != null) {
                this.p_updateByValue()
                await this.$plain.$utils.delay(200)
            }
        },
        computed: {
            styles() {
                const styles = {height: `${this.itemHeight * ((this.itemNum * 2) + 1)}px`}
                this.width != null && (styles.width = this.width + 'px')
                return styles
            },
            externalData() {
                const ret = []
                let i = 0
                while (i < this.itemNum) {
                    ret.push(i)
                    i++
                }
                return ret
            },
        },
        methods: {
            update() {
                this.p_updateByValue()
            },
            /**
             * 处理滚轮滚动事件
             * @author  韦胜健
             * @date    2019/3/11 11:26
             */
            async p_mousewheel(e) {
                this.p_clearTimer()
                this.timer = setTimeout(() => {
                    this.p_scrollEnd(e)
                }, 200)
            },
            /**
             * 处理滚动事件
             * @author  韦胜健
             * @date    2019/2/26 09:15
             */
            p_scroll(e) {
                this.scrollTop = e.target.scrollTop
                this.$emit('scroll', this.scrollTop)
            },
            /**
             * 处理点击事件
             * @author  韦胜健
             * @date    2019/2/26 09:15
             */
            p_click(item, index) {
                this.p_scrollTo(index)
            },
            /**
             * 滚动结束之后，触发动作
             * @author  韦胜健
             * @date    2019/2/26 09:16
             */
            async p_scrollEnd() {
                this.timer = setTimeout(() => {
                    this.scrollTop = Math.ceil(this.scrollTop)
                    if (this.scrollTop % this.itemHeight === 0) {
                        let i = (this.scrollTop / this.itemHeight).toFixed(0) - 0
                        this.p_index = this.p_getValidIndex(i)
                        this.p_scrollTop(this.p_index * this.itemHeight)
                        this.p_emitValue()
                        return
                    }
                    for (let i = 0; i < this.data.length + (this.itemNum * 2); i++) {
                        let start = this.itemHeight * i
                        let end = this.itemHeight * (i + 1)
                        if (start < this.scrollTop && this.scrollTop < end) {
                            this.p_index = this.p_getValidIndex(i)
                            this.p_scrollTop(this.p_index * this.itemHeight)
                            this.p_emitValue()
                        }
                    }
                }, 100)
            },
            /**
             * 清除滚动结束触发动作延时器
             * @author  韦胜健
             * @date    2019/2/26 09:16
             */
            p_clearTimer() {
                if (this.timer != null) {
                    clearTimeout(this.timer)
                    this.timer = null
                }
            },
            /**
             * 滚动到目标索引
             * @author  韦胜健
             * @date    2019/2/26 09:17
             */
            p_scrollTo(index) {
                this.p_index = index
                this.p_emitValue();
                this.p_scrollTop((index) * this.itemHeight)
            },
            /**
             * 派发当前选中值事件
             * @author  韦胜健
             * @date    2019/2/26 09:17
             */
            p_emitValue() {
                this.p_value = this.p_getValue(this.data[this.p_index])
                this.$emit('input', this.p_value)
            },
            /**
             * 根据新值更新位置，滚动到指定位置
             * @author  韦胜健
             * @date    2019/2/26 09:17
             */
            p_updateByValue() {
                for (let i = 0; i < this.data.length; i++) {
                    const item = this.data[i];
                    if (this.p_getValue(item) === this.value) {
                        this.p_index = i
                        this.p_scrollTop((i) * this.itemHeight)
                    }
                }
            },
            /**
             * 获取当前值
             * @author  韦胜健
             * @date    2019/2/26 09:17
             */
            p_getValue(item) {
                return !!this.valueKey ? item[this.valueKey] : item
            },
            /**
             * 滚动到指定高度位置
             * @author  韦胜健
             * @date    2019/2/26 09:18
             */
            p_scrollTop(scrollTop) {
                !!this.$refs.wrapper && scroll.top(this.$refs.wrapper, scrollTop);
            },
            /**
             * 判断是否禁用
             * @author  韦胜健
             * @date    2019/2/26 10:52
             */
            p_isDisabled(index) {
                return !!this.disabledKey && !!this.data[index][this.disabledKey]
            },
            /**
             * 获取index上一个有效item的index值
             * @author  韦胜健
             * @date    2019/2/26 11:10
             */
            p_getValidIndex(index) {
                let target = index
                if (!this.disabledKey) return target
                let direction = 1
                if (this.p_isDisabled(target)) {
                    while (this.p_isDisabled(target)) {
                        target += direction
                        if (target === this.data.length) {
                            target = index - 1
                            direction = -1
                        }
                        if (target === -1) {
                            return 0
                        }
                    }
                }
                return target
            },
        }
    }
</script>