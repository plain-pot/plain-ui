<template>
    <div class="pl" v-if="p_initialized" v-show="show">
        <slot></slot>
    </div>
</template>

<script>
    import PlTabHeader from "./pl-tab-header";

    export default {
        name: "pl-tab",
        components: {PlTabHeader},
        props: {
            title:{},
            initialized: {type: Boolean,},
            destroyedOnHide: {type: Boolean,},
        },
        data() {
            return {
                tabs: null,
                p_initialized: this.initialized,
                show: false,
            }
        },
        watch: {
            show(newVal, oldVal) {
                if (!newVal && !!oldVal && !!this.destroyedOnHide) {
                    this.p_initialized = false
                }
            },
        },
        mounted() {
            this.tabs = this.$plain.$dom.findComponentUpward(this, 'pl-tabs')
            if (!this.tabs) {
                console.error("tab component must be placed in tabs component, can not find parent tabs component!!!")
                return
            }
            this.tabs.p_addItem(this)
        },
        beforeDestroy() {
            this.tabs.p_removeItem(this)
        },
    }
</script>