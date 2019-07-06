<template>
    <div class="pl-tabs" :style="styles">
        <div class="pl-tabs-header">
            <pl-tab-header :data="items" :value="p_value" @click="p_click" valueKey="id" labelKey="title"/>
        </div>
        <div class="pl-tabs-body">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import PlTabHeader from "./pl-tab-header";
    import {ValueMixin} from "../../mixin/component-mixin";

    export default {
        name: "pl-tabs",
        mixins: [ValueMixin],
        components: {PlTabHeader},
        props: {
            value: {type: Number,},
            initialized: {type: Boolean},
            height: {type: Number | String, default: 300},
        },
        watch: {
            p_value() {
                this.update()
            },
        },
        data() {
            return {
                items: [],
            }
        },
        computed: {
            styles() {
                const styles = {}
                this.height !== null && (styles.height = this.$plain.$utils.unit(this.height))
                return styles
            },
        },
        methods: {
            update() {
                this.items.forEach((item, index) => {
                    const show = index === this.p_value
                    const next = () => item.show = show
                    if (show && !item.p_initialized) {
                        item.p_initialized = true
                        this.$nextTick(next)
                    } else {
                        next()
                    }
                })
            },
            p_addItem(item) {
                this.items.push(item)
                !!this.initialized && (!item.p_initialized) && (item.p_initialized = this.initialized)
            },
            p_removeItem(item) {
                this.items.splice(this.items.indexOf(item), 1)
            },
            p_click({item, index}) {
                if (this.p_value !== index) this.p_value = index
                this.p_emitValue()
            },
        },
        mounted() {
            this.p_value = this.value == null ? this.items.length > 0 ? 0 : null : this.value
        },
    }
</script>
