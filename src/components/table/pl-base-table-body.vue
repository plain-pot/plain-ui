<template>
    <div class="pl-base-table-body">
        <pl-base-table-body-item
                v-for="(fixed) in fixeds"
                :key="fixed"
                :ref="fixed"
                :fixed="fixed"
                v-if="fixedExist[fixed]"

                :body-columns="bodyColumns"
                :data="data"
                :body-row-height="bodyRowHeight"
                :show-num="showNum"
                :hover-index="hoverIndex"

                @mouseenter.native="p_hoverFixed = fixed"
                @scroll="e=>pl_scroll(e,fixed)"
                @click="e=>$emit('click',e)"
                @dblclick="e=>$emit('dblclick',e)"
                @mouseenter="e=>$emit('mouseenter',e)"
        />
    </div>
</template>

<script>
    import {TableMixin} from "./index";
    import PlBaseTableBodyItem from "./pl-base-table-body-item";

    export default {
        name: "pl-base-table-body",
        components: {PlBaseTableBodyItem},
        mixins: [
            TableMixin,
        ],
        data() {
            return {
                fixeds: ['center', 'left', 'right'],                                        //固定列位置，用于循环
                p_hoverFixed: null,                                                        //当前鼠标hover的位置：center、left、right，用于判断滚动
                p_calculateTimer: null,                                                    //计算左右滚动的计时器
            }
        },
        methods: {
            pl_scroll(e, fixed) {
                if (fixed === 'center') this.$emit('scroll', e)
                if (fixed !== this.p_hoverFixed) return
                this.fixeds.forEach(ifixed => {
                    if (!!fixed === ifixed) return
                    if (!!this.$refs[ifixed] && this.$refs[ifixed].length === 1) {
                        this.$refs[ifixed][0].$refs.scroll.setScroll({y: e.target.scrollTop})
                    }
                })
                this.pl_calculateScrollDuration()
            },
            pl_calculateScrollDuration() {
                if (!!this.p_calculateTimer) {
                    clearTimeout(this.p_calculateTimer)
                    this.p_calculateTimer = null
                }
                this.p_calculateTimer = setTimeout(() => {
                    const wrapper = this.$refs.center[0].$refs.scroll.$refs.wrapper
                    this.$emit('scrollLeft', wrapper.scrollLeft === 0)
                    this.$emit('scrollRight', Math.abs(wrapper.scrollWidth - wrapper.scrollLeft - wrapper.offsetWidth + 17) < 1)
                }, 50)
            },
        }

    }
</script>

<style lang="scss">
    .pl-base-table-body {
        position: relative;
        overflow: hidden;

        table {
            font-size: 12px;
        }

        .pl-base-table-body-item {
            background-color: white;
        }

        .pl-base-table-body-item-left, .pl-base-table-body-item-right {
            position: absolute;
            top: 0;
        }

        .pl-base-table-body-item-right {
            right: 0;

            .pl-scroll-content-wrapper {
                position: relative;

                .pl-scroll-content {
                    right: 0;
                    position: absolute;
                    float: right;

                    table {
                        float: right;
                    }
                }
            }
        }
    }
</style>