<template>
    <div class="pl-tab-header">
        <pl-list class="pl-tab-header-wrapper" direction="top" draggable :drag-list="data" @switch="pl_switch">
            <pl-item v-if="!data || data.length === 0" class="pl-tab-header-item pl-tab-header-item-active" key="no-item">
                <span>无</span>
            </pl-item>
            <pl-item
                    class="pl-tab-header-item"
                    v-for="(item,index) in data"
                    :key="item[valueKey]"
                    :class="{'pl-tab-header-item-active':index === p_value}"
                    @click="p_click(item,index)"
                    @dblclick="p_dblclick(item,index)"
                    @contextmenu.stop.prevent="e=>pl_contextmenu(e,item,index)">
                <pl-tooltip :content="item[labelKey]" show-overflow-tooltip/>
                <div class="pl-tab-header-item-close" @click.stop="p_close(item,index)" v-if="clearIcon">
                    <pl-icon icon="pad-close-circle-fill" hover/>
                </div>
            </pl-item>
        </pl-list>
        <div class="pl-tab-header-bottom">

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
            clearIcon: {type: Boolean,},
            valueKey: {type: String, require: true},
            labelKey: {type: String, require: true},
        },
        data() {
            return {
                tagWidth: null,
                tagLeft: null,
            }
        },

        methods: {
            p_click(item, index) {
                this.p_value = index
                this.p_emitValue()
                this.$emit('click', {item, index})
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
            pl_switch(data) {
                let index;
                data.originIndex === this.p_value && (index = data.targetIndex)
                data.targetIndex === this.p_value && (index = data.originIndex)
                if (index != null) {
                    this.p_click(this.data[index], index)
                }
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

            .pl-tab-header-bottom {
                background-color: plVar(colorBorder);
                height: 1px;
            }
        }

        .pl-tab-header-item {
            display: inline-flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            width: 200px !important;
            padding: 8px 16px !important;
            position: relative;
            background-color: white;
            cursor: pointer;

            &:after {
                border-right: dashed 1px plVar(colorPrimary);
                position: absolute;
                content: '';
                top: 6px;
                bottom: 6px;
                right: 0;
                width: 1px;
            }

            &:first-child {
                &:before {
                    border-left: dashed 1px plVar(colorPrimary);
                    position: absolute;
                    content: '';
                    top: 6px;
                    bottom: 6px;
                    left: 0;
                    width: 1px;
                }
            }

            .pl-tab-header-item-close {
                font-size: 12px;
                opacity: 0;
            }

            &.pl-tab-header-item-active, &:hover {
                color: plVar(colorPrimary);

                .pl-tab-header-item-close {
                    opacity: 1;
                }
            }
        }
    }
</style>
