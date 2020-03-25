<template>
    <div class="pl-card" :style="styles" :class="[`pl-card-shadow-${shadow}`]">
        <slot></slot>
    </div>
</template>

<script>
    import {PropsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-card",
        mixins: [
            PropsMixinFactory.create({
                width: PropsMixinFactory.Number,
                height: PropsMixinFactory.Number,
            })
        ],
        props: {
            width: {default: '300px'},
            height: {default: '300px'},
            shadow: {type: String, default: 'always'},
        },
        computed: {
            styles() {
                const styles = {}
                this.p_width !== null && (styles.width = this.$plain.utils.suffixPx(this.p_width))
                this.p_height !== null && (styles.height = this.$plain.utils.suffixPx(this.p_height))
                return styles
            },
        },
    }
</script>