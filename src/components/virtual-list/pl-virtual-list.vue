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
            dynamicSize: {type: Boolean},                               // 每一行的高度不确定，但是此时size仍然需要提供，而且不能与实际值相差太大
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
        },
        data() {
            return {
                start: 0,                       // 可视区域中，第一条数据的索引
                end: this.remain || 0,          // 一屏数据最后一条数据的索引
                offset: 0,                      // 可视区域偏移 top 距离

                p_remain: null,                 // 一屏数据的行数
                adjust: 0,                      // dynamicHeight情况下， 修正高度
                adjustedMap: {},                // 已经修正过的记录的索引
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
                    height: `${this.data.length * this.size + this.adjust}px`
                }
            },
            contentStyles() {
                return {
                    transform: `translate3d(0,${this.offset}px,0)`
                }
            },
        },
        updated() {
            if (!!this.dynamicSize) this.updateAdjust()
        },
        methods: {
            /*---------------------------------------listener-------------------------------------------*/
            onScroll(e) {
                const scrollTop = e.target.scrollTop
                this.start = Math.floor(scrollTop / this.size)
                this.end = this.start + this.p_remain
                this.offset = (this.targetStart) * this.size
            },
            updateAdjust() {
                const childNodes = Array.from(this.content.children)
                const ret = childNodes.map(childNode => {
                    const vid = childNode.getAttribute('vid') - 0
                    if (!this.adjustedMap[vid]) {
                        // console.log(childNode.offsetHeight, vid, this.data[vid].size)
                        this.adjust += (childNode.offsetHeight - this.size)
                        console.log(this.adjust)
                        this.adjustedMap[vid] = true
                    }
                })
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