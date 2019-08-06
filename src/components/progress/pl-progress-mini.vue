<template>
    <canvas class="pl-progress-mini" width="300" height="300"></canvas>
</template>

<script>
    export default {
        name: "pl-progress-mini",
        props: {
            value: {type: Number, default: 100},
            outerColor: {type: String, default: '#f2f2f2'},
            innerColor: {type: String, default: '#12b4a5'},
            speed: {type: Number, default: 3},
            status: {type: String, default: 'normal'},
            successColor: {type: String, default: '#42E67F'},
            errorColor: {type: String, default: '#FF6235'},
            inlineText: {type: Boolean},

            size: {default: 100},
        },
        watch: {
            value(val) {
                this.animatePercent = val
                this.draw(val)
            },
        },
        data() {
            return {
                ctx: null,
                animatePercent: 0,
            }
        },
        mounted() {
            this.ctx = this.$el.getContext("2d")
            this.reload()
        },
        computed: {
            arcParam() {
                return [this.size / 2, this.size / 2, this.size / 2, 0]
            },
        },
        methods: {
            reload() {
                this.animatePercent = 0
                this.DreamLoading()
            },
            draw(animatePercent) {
                this.ctx.clearRect(0, 0, this.size, this.size)
                this.drawSector(animatePercent)
            },
            drawSector(animatePercent) {
                this.ctx.save();

                this.ctx.fillStyle = 'black'
                this.ctx.beginPath()
                this.ctx.moveTo(this.size / 2, this.size / 2)
                this.ctx.arc(...this.arcParam, (1 - (animatePercent / 100)) * Math.PI * 2, false);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.restore();
            },
            DreamLoading() {
                if (this.animatePercent <= this.value) {
                    this.animatePercent += this.speed;
                    this.draw(this.animatePercent)
                } else {
                    this.animatePercent = this.value
                    this.draw(this.animatePercent)
                    return
                }
                requestAnimationFrame(this.DreamLoading);
            },
        }
    }
</script>

<style lang="scss">

</style>
