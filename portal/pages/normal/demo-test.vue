<template>
    <div class="demo-test">
        <im-demo-row title="测试虚拟化加载大量数据">
            <div style="display: flex">
                <div class="demo-test-box">
                    <im-scroll @vertical-scroll-top="pl_scrollTop"
                               @vertical-scroll-bottom="pl_scrollBottom"
                               ref="scroll"
                               :scrollbarSize="6"
                               :topScrollDuration="3"
                               :bottomScrollDuration="3"
                    >
                        <div v-for="(item,index) in p_data" :key="index" class="demo-test-item" :style="{backgroundColor:(item%p_chunkSize)===0?'rgba(0,0,0,0.05)':'transparent'}">
                            <im-icon :icon="item%2 === 0?'pad-check-square':'pad-check-square-fill'" style="margin-right: 12px"/>
                            <span>{{item+1}}</span>
                        </div>
                    </im-scroll>
                </div>
                <span style="vertical-align: top">
                {{p_data}}
            </span>
            </div>
        </im-demo-row>
    </div>
</template>

<script>


    export default {
        name: "demo-test",
        data() {
            const data = []
            for (let i = 0; i < 100000; i++) {
                data.push(i)
            }

            const p_chunkSize = 20
            const chunks = this.$plain.$utils.chunk(data, p_chunkSize)

            return {
                data,
                chunks,
                nowChunks: [],

                p_data: [],
                p_index: 0,
                p_chunkSize,
            }
        },
        created() {
            this.p_index = 0
            this.p_data = []
            this.p_loadChunk(0)
            this.p_loadChunk(1)
        },
        methods: {

            p_loadChunk(index) {
                const chunk = this.chunks[index]
                this.p_data.push(...chunk)
                this.nowChunks.push(chunk)
            },
            p_loadNextPage() {
                if (!!this.chunks[this.p_index + 2]) {
                    /*load chunk*/
                    const loadChunk = this.chunks[this.p_index + 2]
                    this.p_data.push(...loadChunk)
                    this.nowChunks.push(loadChunk)

                    this.p_index++

                    if (this.nowChunks.length > 3) {
                        /*unload chunk*/
                        const unloadChunk = this.nowChunks.shift()
                        this.p_data.splice(0, unloadChunk.length)
                    }
                    return true
                }
            },
            p_loadPrevPage() {
                if (!!this.chunks[this.p_index - 2]) {

                    const loadChunk = this.chunks[this.p_index - 2]
                    this.p_data.unshift(...loadChunk)
                    this.nowChunks.unshift(loadChunk)

                    this.p_index--

                    if (this.nowChunks.length > 3) {
                        const unloadChunk = this.nowChunks.pop()
                        this.p_data.splice(this.p_data.length - unloadChunk.length, unloadChunk.length)
                    }
                    return true
                }
            },

            async pl_scrollTop() {
                if (this.p_index > 0) {
                    this.p_loadPrevPage() && this.startResetScrollTop()
                }
            },
            async pl_scrollBottom() {
                if ((this.p_index + 1) * this.p_chunkSize <= this.data.length) {
                    this.p_loadNextPage() && this.startResetScrollTop()
                }
            },
            startResetScrollTop() {
                if (!this.p_count) this.p_count = 0
                this.p_count++
                setTimeout(() => {
                    this.$refs.scroll.$refs.wrapper.scrollTop = this.p_chunkSize * 30
                    if (this.p_count + 1 > 10) {
                        this.p_count = 0
                        return
                    }
                    this.startResetScrollTop()
                }, 25)
            },
        }
    }
</script>

<style lang="scss">
    .demo-test-box {
        height: 600px;
        width: 300px;
        border: solid 1px #e4e7ed;
        border-radius: 4px;
        display: inline-block;

        .demo-test-item {
            height: 30px;
            width: 100%;
            padding: 0 12px;
            display: flex;
            align-items: center;
        }
    }
</style>