<template>
    <div class="pl-cascade-option" :style="{width:`${cascadeWidth}px`}" v-if="!!data && data.length>0">
        <pl-scroll fit-host-width :scrollbar-size="6">
            <pl-cascade-option-item v-for="(item,index) in data"
                                    :key="item[valueKey]+index"

                                    :data="item"
                                    :label-key="labelKey"
                                    :children-key="childrenKey"
                                    :value-key="valueKey"
                                    :disabled-key="disabledKey"
                                    :current="current"
                                    :load-data-func="loadDataFunc"

                                    @click="component=>p_click(item,component)"/>
        </pl-scroll>
    </div>
</template>

<script>
    import PlCascadeOptionItem from "./pl-cascade-option-item";
    import {CascadeMixin} from "./index";
    import PlScroll from "../pl-scroll";

    export default {
        name: "pl-cascade-option",
        components: {PlScroll, PlCascadeOptionItem},
        mixins: [CascadeMixin],
        methods: {
            p_click(itemData, component) {
                if (!!this.disabledKey && !!itemData[this.disabledKey]) return
                this.$emit('select', itemData)
                if (!component.p_hasChildren) this.$emit('done', itemData)
            },
        },

    }
</script>