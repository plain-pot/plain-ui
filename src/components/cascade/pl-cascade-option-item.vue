<template>
    <div class="pl-cascade-option-item" @click="p_click" :class="classes">
        <span class="pl-cascade-option-item-label">{{data[labelKey]}}</span>
        <!--[{{!p_dataLoaded}}-{{p_hasChildren}}-->
        <pl-icon class="pl-cascade-option-item-icon" icon="pad-right" v-if="!p_dataLoaded || p_hasChildren"/>
    </div>
</template>

<script>
    import {CascadeMixin} from "./index";
    import PlIcon from "../pl-icon";

    export default {
        name: "pl-cascade-option-item",
        components: {PlIcon},
        mixins: [CascadeMixin],
        data() {
            return {
                p_dataLoaded: !this.loadDataFunc || (!!this.data[this.childrenKey] && this.data[this.childrenKey].length > 0)
            }
        },
        computed: {
            classes() {
                return {
                    'pl-cascade-option-item-active': this.p_isSelected,
                    'pl-cascade-option-item-disabled': !!this.disabledKey && this.data[this.disabledKey]
                }
            },
            p_isSelected() {
                if (!this.current) return false
                return this.data[this.valueKey] === this.current[this.valueKey]
            },
            p_hasChildren() {
                return !!this.data[this.childrenKey] && this.data[this.childrenKey].length > 0
            },
        },
        methods: {
            async p_click() {
                if (!this.p_dataLoaded) {
                    const childrenData = await this.loadDataFunc(this.data)
                    this.$set(this.data, this.childrenKey, childrenData)
                    this.p_dataLoaded = true
                }
                this.$emit('click', this)
            },
        }
    }
</script>