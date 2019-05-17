<template>
    <div class="pl-nav-header" @mousewheel.stop.prevent="pl_mousewheel">
        <div class="pl-nav-header-item pl-nav-target"
             ref="items"
             :class="{'pl-nav-header-item-active':index === p_value}"
             v-for="(item,index) in list"
             @click="$emit('click',{item,index})"
             @contextmenu.stop.prevent="e=>$emit('contextmenu',{e,item,index,el:$refs.items[index]})"
             :key="item[valueKey]">
            <div class="pl-nav-header-item-content">
                <pl-tooltip-text show-overflow-tooltip :content="item[labelKey]"/>
                <div class="pl-nav-header-item-close" @click.stop="$emit('close',{item,index})">
                    <pl-icon :icon="index === p_value?'pad-close-circle-fill':'pad-close'" hover class="pl-nav-header-close-icon"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {ValueMixin} from "../../mixin/component-mixin";
    import PlIcon from "../pl-icon";
    import PlTooltipText from "../pl-tooltip-text";

    export default {
        name: "pl-nav-header",
        components: {PlTooltipText, PlIcon},
        mixins: [ValueMixin],
        props: {
            list: {type: Array, default: () => []},
            labelKey: {type: String},
            valueKey: {type: String},
        },
        methods: {
            pl_mousewheel(e) {
                if (this.$el.scrollWidth <= this.$el.offsetWidth) return
                this.$el.scrollLeft = (this.$el.scrollLeft || 0) + e.deltaY + e.deltaX
            },
        }
    }
</script>