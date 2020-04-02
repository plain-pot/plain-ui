<template>
    <div class="test-canvas">
        <demo-row>
            <canvas ref="canvas" class="canvas" width="300" height="200"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "test-canvas",
        props: {},
        data() {
            return {}
        },
        methods: {},
        mounted() {
            const canvas = this.$refs.canvas
            const ctx = canvas.getContext('2d');

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(200,0);
            ctx.lineTo(300, 100);
            ctx.lineTo(200, 200);
            ctx.lineTo(0, 200);
            ctx.lineTo(100, 100);
            ctx.fill();
        }
    }
</script>

<style lang="scss">
    .test-canvas {
        .canvas {
            /*width: 300px;
            height: 200px;*/
            /*background-color: #ddd;*/
        }
    }
</style>