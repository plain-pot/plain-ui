<template>
    <div class="demo-sticky">
        <demo-row title="基本用法"></demo-row>
        <div class="demo-sticky-container">
            <pl-scroll scrollX fitHostWidth>
                <div class="list">
                    <div class="item" v-for="(item,index) in 3" :key="item">
                        {{index}}、{{item}}
                    </div>
                    <pl-scroll-sticky class="item" top="0">
                        固定在顶部
                    </pl-scroll-sticky>
                    <div class="item" v-for="(item,index) in 30" :key="item">
                        {{index}}、{{item}}
                    </div>
                </div>
            </pl-scroll>
        </div>
    </div>
</template>

<script>
    export default {
        name: "demo-sticky"
    }
</script>

<style lang="scss">
    .demo-sticky-container {
        width: 700px;
        height: 300px;

        .list {
            .item {
                padding: 16px;
                margin-bottom: 1px;
                background-color: #f2f2f2;
            }
        }
    }
</style>