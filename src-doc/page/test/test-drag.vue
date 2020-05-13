<template>
    <div class="test-drag">
        <button draggable="true" @dragstart="draggable.source.dragstart" @drag="draggable.source.drag" @dragend="draggable.source.dragend" @dragexit="draggable.source.dragexit">
            test-drag
        </button>
        <div style="height: 100px;width: 100px;background-color: #12b4a5"
             @dragenter="draggable.target.dragenter"
             @dragover="draggable.target.dragover"
             @dragleave="draggable.target.dragleave"
             @drop="draggable.target.drop">

        </div>

        <div style="height: 100px;width: 100px;background-color: #FFB273"
             @dragenter="draggable.target.dragenter"
             @dragover="draggable.target.dragover"
             @dragleave="draggable.target.dragleave"
             @drop="draggable.target.drop">

        </div>
    </div>
</template>

<script>
    export default {
        name: "test-drag",
        props: {},
        data() {
            let dragNode;
            let dropNode;
            return {
                draggable: {
                    source: {
                        dragstart: e => {
                            // console.log('source -> dragstart')
                            e.dataTransfer.effectAllowed = 'move'
                            dragNode = e.target
                        },
                        drag: e => {
                            // console.log('source -> drag')
                        },
                        dragend: e => {
                            // console.log('source -> dragend')
                            dropNode = dropNode || this.$el
                            dropNode.appendChild(dragNode)
                        },
                        dragexit: e => {
                            // console.log('source -> dragexit')
                        },
                    },
                    target: {
                        dragenter: e => {
                            // console.log('target -> dragenter')
                            e.dataTransfer.dropEffect = 'move'
                            dropNode = e.target
                        },
                        dragover: e => {
                            // console.log('target -> dragover')
                            e.preventDefault()
                        },
                        dragleave: e => {
                            // console.log('target -> dragleave')
                            e.dataTransfer.dropEffect = 'none'
                            if (dropNode === e.target) {
                                dropNode = null
                            }
                        },
                        drop: e => {
                            // console.log('target -> drop')
                            e.preventDefault()
                        },
                    },
                },
            }
        },
        methods: {},
        mounted() {
        }
    }
</script>

<style lang="scss">
</style>