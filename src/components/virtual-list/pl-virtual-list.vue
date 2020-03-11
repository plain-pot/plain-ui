<template>
    <pl-scroll class="pl-virtual-list" @scroll="onScroll" scrollbarColor="black" ref="scroll">
        <div class="pl-virtual-list-strut" :style="strutStyles">
            <div class="pl-virtual-list-content" :style="contentStyles" ref="content">
                <template v-for="({item,index}) in targetData">
                    <slot :item="item" :index="index"></slot>
                </template>
            </div>
        </div>
    </pl-scroll>
</template>

<script>
    import {MountedMixin, RefsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-virtual-list",
        mixins: [
            MountedMixin,
            RefsMixinFactory({
                scroll: null,
                content: null,
            })
        ],
        props: {
            data: {type: Array, require: true},                         // 要渲染的长数据
            size: {type: Number, require: true},                        // 每一行高度
            remain: {type: Number, require: true},                      // 一屏渲染的行数，总共渲染三屏，一屏渲染个数越多，滚动效果越好，但是浏览器卡顿的效果可能更明显；如果不传remain，则根据size以及 pl-virtual-list 跟节点的高度自动计算行数
            dynamicSize: {type: Boolean},                               // 标识列表中的每一行高度不是固定的，但是还是需要提供 size 属性，而且size属性不能与每一行的高度差距太多；
        },
        watch: {
            remain: {
                immediate: true,
                handler(val) {
                    if (!!val) this.p_remain = val
                    else {
                        // 自动计算 remain
                        this.$nextTick(() => {
                            this.start = 0
                            this.p_remain = Math.floor(this.$el.offsetHeight / this.size)
                            this.end = this.p_remain
                        })
                    }
                },
            },
            data: {
                immediate: true,
                handler(val) {
                    if (!this.dynamicSize) return
                    val = val || []
                    this.dataInfo = val.map((item, index) => ({
                        top: index * this.size,
                        height: this.size,
                        bottom: this.size * (index + 1),
                    }));
                    !!this.scroll && this.scroll.scrollTo({y: 0})
                },
            },
        },
        data() {
            return {
                start: 0,                               // 渲染元素第一个索引
                end: this.remain || 0,                  // 渲染元素最后一个元素的索引
                offset: 0,                              // content节点偏移顶部的高度

                p_remain: null,                         // 一屏渲染的个数
                dataInfo: null,                         // 所有的位置信息
            }
        },
        async updated() {
            if (!this.dynamicSize) return
            // 页面渲染完成之后，需要根据当前展示的数据，更新缓存的内容
            await this.$plain.nextTick()
            const nodes = Array.from(this.content.childNodes || [])

            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                const height = node.offsetHeight
                let vid = node.getAttribute('vid')
                if (vid == null) {
                    throw new Error('Each item of the virtual-list must have an attribute named "vid", please set :vid="index"')
                }
                vid = vid - 0
                const prevDataInfo = this.dataInfo[vid]
                const prevHeight = prevDataInfo.height
                let delta = prevHeight - height
                if (delta !== 0) {
                    prevDataInfo.height = height
                    prevDataInfo.bottom = prevDataInfo.bottom - delta
                    for (let j = vid + 1; j < this.dataInfo.length; j++) {
                        this.dataInfo[j].top = this.dataInfo[j - 1].bottom
                        this.dataInfo[j].bottom = this.dataInfo[j].bottom - delta
                    }
                }
            }
        },
        computed: {
            targetStart() {
                return this.start - Math.min(this.start, this.p_remain)
            },
            targetEnd() {
                return this.end + Math.min(this.data.length - this.end, this.p_remain)
            },
            targetData() {
                if (!this.p_remain) return []
                return (this.data || []).map((item, index) => ({item, index})).slice(this.targetStart, this.targetEnd)
            },
            strutStyles() {
                return {
                    height: `${!!this.dynamicSize ? this.dataInfo[this.dataInfo.length - 1].bottom : this.data.length * this.size}px`
                }
            },
            contentStyles() {
                return {
                    transform: `translate3d(0,${this.offset}px,0)`
                }
            },
        },
        methods: {
            /*---------------------------------------listener-------------------------------------------*/
            onScroll(e) {
                const scrollTop = e.target.scrollTop

                if (!this.dynamicSize) {
                    // 固定高度
                    this.start = Math.floor(scrollTop / this.size)
                    this.offset = (this.targetStart) * this.size
                } else {
                    // 动态高度
                    this.start = this.getStartByDynamic(scrollTop)
                    this.offset = this.dataInfo[this.targetStart].top
                }

                this.end = this.start + this.p_remain
            },

            /*---------------------------------------utils-------------------------------------------*/
            /**
             * 使用二分查找算法，根据当前的scrollTop查找在dataInfo中对应的开始元素
             * @author  韦胜健
             * @date    2020/3/11 14:39
             */
            getStartByDynamic(scrollTop) {
                let start = 0;
                let end = this.dataInfo.length - 1
                let temp = null;

                while (start <= end) {
                    let middle = Math.floor((start + end) / 2)
                    let middleBottom = this.dataInfo[middle].bottom
                    if (middleBottom === scrollTop) {
                        return middle + 1
                    } else if (middleBottom < scrollTop) {
                        start = middle + 1
                    } else if (middleBottom > scrollTop) {
                        if (!temp || temp > middle) {
                            temp = middle
                        }
                        end = middle - 1
                    }
                }
                return temp
            },
        },
    }
</script>

<style lang="scss">
    .pl-virtual-list {
        .pl-virtual-list-strut {
            position: relative;
            overflow: hidden;

            .pl-virtual-list-content {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
            }
        }
    }
</style>