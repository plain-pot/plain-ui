<template>
    <div class="test-drag">
        <button draggable="true" @dragstart="draggable.start" @drag="draggable.drag" @dranend="draggable.end">test-drag</button>
        <div style="height: 100px;width: 100px;background-color: #12b4a5" @drop="draggable.drop">

        </div>
    </div>
</template>

<script>
    export default {
        name: "test-drag",
        props: {},
        data() {
            return {
                draggable: {
                    start: (e) => {
                        console.log('start')
                    },
                    drag: e => {
                        console.log('drag')
                    },
                    end: e => {
                        console.log('end')
                    },
                    drop: e => {
                        console.log('drop')
                    },
                },
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>