<template>
    <div class="pl-tab-header">
        <div class="pl-tab-header-wrapper">
            <div v-if="!data || data.length === 0" class="pl-tab-header-item pl-tab-header-item-active">
                <span>无</span>
            </div>
            <div class="pl-tab-header-item"
                 v-for="(item,index) in data"
                 ref="items"
                 :key="!!ids&&ids[index]?ids[index]:item"
                 :class="{'pl-tab-header-item-active':index === p_value}"
                 @click="p_click(item,index)"
                 @dblclick="p_dblclick(item,index)"
                 @contextmenu.stop.prevent="e=>pl_contextmenu(e,item,index)">
                <span ref="text">{{item}}</span>
                <div class="pl-tab-header-item-close" @click.stop="p_close(item,index)" v-if="clearIcon">
                    <pl-icon icon="pad-close" hover/>
                </div>
            </div>
        </div>

        <div class="pl-tab-header-bottom">
            <div class="pl-tab-header-bottom-tag" :style="tagStyles"></div>
        </div>
    </div>
</template>

<script>
    import {ValueMixin} from "../../mixin/component-mixin";
    import PlIcon from "../pl-icon";
    import PlList from "../list/pl-list";
    import PlItem from "../list/pl-item";
    import PlTooltip from "../tooltip/pl-tooltip";

    export default {
        name: "pl-tab-header",
        components: {PlTooltip, PlItem, PlList, PlIcon,},
        mixins: [ValueMixin],
        props: {
            value: {type: Number, default: 0},
            data: {type: Array, default: () => []},
            ids: {type: Array, default: () => []},
            clearIcon: {type: Boolean,},
        },
        data() {
            return {
                tagWidth: null,
                tagLeft: null,
            }
        },
        watch: {
            data: {
                immediate: true,
                handler() {
                    this.refreshTag()
                },
            },
        },
        methods: {
            async refreshTag() {
                await this.$plain.nextTick()
                await this.$plain.$utils.delay(200)
                if (!this.$refs.items || !this.$refs.items[this.p_value]) return
                const itemEl = this.$refs.items[this.p_value]
                this.tagWidth = itemEl.offsetWidth
                this.tagLeft = itemEl.offsetLeft
            },
            p_click(item, index) {
                this.p_value = index
                this.p_emitValue()
                this.$emit('click', {item, index})
                this.refreshTag()
            },
            p_close(item, index) {
                this.$emit('close', {item, index})
            },
            p_dblclick(item, index) {
                this.$emit('dblclick', {item, index})
            },
            pl_contextmenu(e, item, index) {
                let el = e.target
                while (!!el.parentNode && !this.$plain.$dom.hasClass(el, 'pl-tab-header-item')) {
                    el = el.parentNode
                }
                this.$emit('contextmenu', {e, item, index, el})
            },
        },
        computed: {
            tagStyles() {
                const ret = {}
                this.tagWidth != null && (ret.width = this.$plain.$utils.unit(this.tagWidth))
                this.tagLeft != null && (ret.left = this.$plain.$utils.unit(this.tagLeft))
                return ret
            },
        },
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-tab-header {
            @include public-style;
            display: block;
            position: relative;

            .pl-tab-header-wrapper {
                width: 100%;

                .pl-tab-header-item {
                    display: inline-block;
                    position: relative;
                    padding: 16px 24px;
                    min-width: 120px;
                    cursor: pointer;
                    user-select: none;

                    .pl-tab-header-item-close {
                        position: absolute;
                        right: 6px;
                        top: 0;
                        bottom: 0;
                        display: flex;
                        align-items: center;
                        opacity: 0;
                    }

                    &:after {
                        position: absolute;
                        top: 16px;
                        bottom: 16px;
                        right: 0;
                        content: '';
                        width: 1px;
                        border-right: dashed 1px plVar(colorPrimaryLight);
                    }

                    &:first-child {
                        &:before {
                            position: absolute;
                            top: 16px;
                            bottom: 16px;
                            left: 0;
                            content: '';
                            width: 1px;
                            border-left: dashed 1px plVar(colorPrimaryLight);
                        }
                    }

                    &:hover, &.pl-tab-header-item-active {
                        color: plVar(colorPrimary);

                        .pl-tab-header-item-close {
                            opacity: 1;
                        }
                    }
                }
            }

            .pl-tab-header-bottom {

            }

            .pl-tab-header-bottom {
                position: absolute;
                right: 0;
                left: 0;
                bottom: 0;
                height: 2px;
                content: '';
                background-color: plVar(colorPrimaryLighter);

                .pl-tab-header-bottom-tag {
                    height: 100%;
                    background-color: plVar(colorPrimary);
                    position: absolute;
                    @include transition-all;
                }
            }

        }
    }
</style>