<template>
    <div class="pl-card" :style="styles" :class="[`pl-card-shadow-${shadow}`]">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "pl-card",
        props: {
            width: {default: '300px'},
            height: {default: '300px'},
            shadow: {type: String, default: 'always'},
        },
        computed: {
            styles() {
                const styles = {}
                this.width !== null && (styles.width = this.$plain.$utils.unit(this.width))
                this.height !== null && (styles.height = this.$plain.$utils.unit(this.height))
                return styles
            },
        },
    }
</script>