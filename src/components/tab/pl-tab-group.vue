<template>
    <div class="pl-tab-group">
        <div class="pl-tab-head-wrapper">
            <div class="pl-tab-head-bottom"/>
            <pl-scroll :scrollY="false" :scrollX="true" :scrollbarSize="6" ref="headScroll">
                <ul class="pl-tab-head" ref="head" @mousewheel="onMousewheelHeadList">
                    <li v-for="(item) in sortItems"
                        :key="item.tabId"
                        class="pl-tab-head-item"
                        :class="{'pl-tab-head-item-current':item.tabId === p_value}"
                        @click="onClickTitle(item)">
                        {{item.title}}
                    </li>
                    <li class="pl-tab-head-indicator" :style="headIndicatorStyles"></li>
                </ul>
            </pl-scroll>
        </div>
        <ul class="pl-tab-body">
            <slot></slot>
        </ul>
    </div>
</template>

<script>
    import {EmitMixin, RefsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-tab-group",
        props: {
            value: {},
        },
        mixins: [
            EmitMixin,
            RefsMixinFactory({
                head: Object,
                headScroll: Object,
            })
        ],
        emitters: {
            emitInput: Function,
        },
        provide() {
            return {
                plTabGroup: this,
            }
        },
        data() {
            // 刷新每个step的index，以便step知道自己处于哪个位置
            const refreshStepIndex = this.$plain.utils.debounce((callback) => {
                this.items.forEach(item => item.refreshIndex())
                if (!!callback) callback()
            }, 100)

            const {value: p_value} = this

            return {
                items: [],
                refreshStepIndex,

                p_value,
            }
        },
        computed: {
            sortItems() {
                return this.items.sort((a, b) => a.index - b.index)
            },
            currentIndex() {
                const target = this.$plain.utils.findOne(this.sortItems, item => item.tabId == this.p_value, true)
                if (!!target) {
                    return target.index
                }
            },
            headIndicatorStyles() {
                let offsetLeft, offsetWidth;
                const currentIndex = this.currentIndex
                if (!this.head || !this.head.childNodes) {
                    return null
                }
                for (let i = 0; i < this.head.childNodes.length; i++) {
                    const childNode = this.head.childNodes[i]
                    if (currentIndex === i) {
                        offsetLeft = childNode.offsetLeft
                        offsetWidth = childNode.offsetWidth
                    }
                }
                return {
                    width: `${offsetWidth}px`,
                    left: `${offsetLeft}px`,
                }
            },
        },
        methods: {
            /*---------------------------------------utils-------------------------------------------*/
            addItem(item) {
                this.items.push(item)
                this.refreshStepIndex(this.p_value == null ? () => {
                    this.p_value = this.items[0].tabId
                } : null)
            },
            removeItem(item) {
                this.items.splice(this.items.indexOf(item), 1)
                this.refreshStepIndex()
            },
            /*---------------------------------------handler-------------------------------------------*/
            onClickTitle(item) {
                this.p_value = item.tabId
                this.emitInput(this.p_value)
            },
            onMousewheelHeadList(e) {
                e.stopPropagation()
                e.preventDefault()
                let oldLeft = this.headScroll.p_wrapperScrollLeft
                let delta = e.deltaX || e.deltaY
                this.headScroll.scroll({x: oldLeft + delta})
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-tab-group {

            .pl-tab-head-wrapper {
                overflow: auto;
                width: 100%;
                position: relative;

                & > .pl-scroll {
                    & > .pl-horizontal-scrollbar-wrapper {
                        bottom: 12px;
                    }
                }

                .pl-tab-head-bottom {
                    position: absolute;
                    bottom: 20px;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background-color: $ibl;
                }
            }

            .pl-tab-head, .pl-tab-body {
                margin: 0;
                padding: 0;
                list-style: none;

                &.pl-tab-head {
                    white-space: nowrap;
                    display: inline-block;
                    position: relative;
                    min-width: 100%;

                    .pl-tab-head-item {
                        padding: 12px 0;
                        font-size: 14px;
                        color: $itc;
                        cursor: pointer;
                        user-select: none;

                        &:hover {
                            color: $colorPrimary;
                        }

                        &.pl-tab-head-item-current {
                            color: $colorPrimary;
                        }

                        &:not(:first-child) {
                            margin-left: 16px;
                        }
                    }

                    .pl-tab-head-indicator {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        height: 2px;
                        background-color: $colorPrimary;
                        transition: all 500ms $transition;
                    }
                }

                & > li {
                    display: inline-block;
                }

                .pl-tab {
                }
            }
        }
    }
</style>