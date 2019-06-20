<template>
    <div class="pl-tab-header">
        <pl-list direction="top">
            <pl-item v-if="!data || data.length === 0" key="empty" class="pl-tab-header-item-active">
                <div class="pl-tab-header-item">
                    <span>无</span>
                </div>
            </pl-item>
            <pl-item v-for="(item,index) in data"
                     ref="items"
                     :key="!!ids&&ids[index]?ids[index]:item"
                     :class="{'pl-tab-header-item-active':index === p_value}">
                <div class="pl-tab-header-item"
                     @click="p_click(item,index)"
                     @dblclick="p_dblclick(item,index)"
                     @contextmenu.stop.prevent="e=>pl_contextmenu(e,item,index)">
                    <span ref="text">{{item}}</span>
                    <div class="pl-tab-header-item-close" @click.stop="p_close(item,index)" v-if="clearIcon">
                        <pl-icon icon="pad-close" hover/>
                    </div>
                </div>
            </pl-item>

        </pl-list>
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
            }
        },
        methods: {
            async refreshTag() {
                if (this.p_value == null) return
                if (!this.$refs.text) return
                await this.$plain.nextTick()
                const textEl = this.$refs.text[this.p_value]
                if (!textEl) return
                const itemEl = this.$refs.items[this.p_value].$el
                this.tagWidth = textEl.offsetWidth
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
</style>