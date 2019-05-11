<template>
    <div class="pl-color" :style="styles" @click="$emit('click',color)">
        <div class="pl-color-inner" :style="innerStyles">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pl-color",
        props: {
            color: {},
            length: {type: Number, default: 24},
            round: {type: Boolean, default: true},
        },
        data() {
            return {
                backgroundImage: require('src/asserts/opacity.png'),

            }
        },
        computed: {
            styles() {
                const styles = {
                    width: this.$plain.$utils.unit(this.length),
                    height: this.$plain.$utils.unit(this.length),
                    backgroundImage: `url(${this.backgroundImage})`
                }
                this.round && (styles.borderRadius = this.$plain.$utils.unit(this.length))
                return styles
            },
            innerStyles() {
                return {
                    backgroundColor: this.color,
                }
            },
        },
    }
</script>