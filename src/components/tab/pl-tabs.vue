<template>
    <div class="pl-tabs" :style="styles">
        <div class="pl-tabs-header">
            <pl-tab-header :data="titles" :value="currentValue" @click="p_click"/>
        </div>
        <div class="pl-tabs-body">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import PlTabHeader from "./pl-tab-header";

    export default {
        name: "pl-tabs",
        components: {PlTabHeader},
        props: {
            value: {type: Number,},
            initialized: {type: Boolean},
            height: {type: Number | String, default: 300},
        },
        watch: {
            value(val) {
                this.currentValue !== val && (this.currentValue = val)
            },
            currentValue(val) {
                this.$emit('input', val)
                this.update()
            },
        },
        data() {
            return {
                currentValue: null,
                items: [],
            }
        },
        computed: {
            styles() {
                const styles = {}
                this.height !== null && (styles.height = this.$plain.$utils.unit(this.height))
                return styles
            },
            titles() {
                return this.items.map(item => item.title)
            },
        },
        methods: {
            update() {
                this.items.forEach((item, index) => {
                    const show = index === this.currentValue
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
                if (this.currentValue !== index) this.currentValue = index
            },
        },
        mounted() {
            this.currentValue = this.value == null ? this.items.length > 0 ? 0 : null : this.value
        },
    }
</script>