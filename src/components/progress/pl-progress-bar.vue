<template>
    <div class="pl-progress-bar">
        <div class="pl-progress-bar-outer" :style="outerStyles">
            <div class="pl-progress-bar-inner" :style="innerStyles"></div>
        </div>
        <span class="pl-progress-bar-content">{{animatePercent}}%</span>
    </div>
</template>

<script>
    export default {
        name: "pl-progress-bar",
        props: {
            value: {type: Number},
            width: {type: String, default: '300px'},
            height: {type: String, default: '6px'},
            outerColor: {type: String},
            innerColor: {type: String},
            speed: {},
        },
        data() {
            return {
                animatePercent: 0,
            }
        },
        mounted() {
            this.reload()
        },
        computed: {
            outerStyles() {
                return {
                    height: this.height,
                    width: this.width,
                    backgroundColor: this.outerColor,
                    borderRadius: this.width,
                }
            },
            innerStyles() {
                return {
                    width: `${this.animatePercent}%`,
                    backgroundColor: this.innerColor,
                    borderRadius: this.width,
                }
            },
        },
        methods: {
            reload() {
                this.animatePercent = 0
                this.animateLoading()
            },
            animateLoading() {
                if (this.animatePercent <= this.value) {
                    this.animatePercent += this.speed;
                } else {
                    this.animatePercent = this.value
                    return
                }
                requestAnimationFrame(this.animateLoading);
            },
        },
    }
</script>

<style lang="scss">

</style>