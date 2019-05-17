<template>
    <div class="pl-nav-header">
        <div class="pl-nav-header-item pl-nav-target"
             :class="{'pl-nav-header-item-active':index === p_value}"
             v-for="(item,index) in list"
             @click="$emit('click',{item,index})"
             @contextmenu.stop.prevent="$emit('contextmenu',{item,index})"
             :key="item[valueKey]">
            <div class="pl-nav-header-item-content">
                <pl-tooltip-text show-overflow-tooltip :content="item[labelKey]"/>
                <div class="pl-nav-header-item-close" @click.stop="$emit('close',{item,index})">
                    <pl-icon icon="pad-close" hover/>
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
            enter(el) {
                el.style.flex = 0
            },
            afterEnter(el) {
                el.style.flex = 1
            },
            leave(el) {
                el.style.flex = 0
            },
        }
    }
</script>