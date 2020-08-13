<template>
    <div class="demo-sticky">
        <demo-row title="基本用法">
            <div class="demo-sticky-container">
                <pl-scroll scrollX fitHostWidth>
                    <div class="list">
                        <pl-scroll-sticky class="item light" top="0">
                            顶部内容，固定在顶部
                        </pl-scroll-sticky>
                        <div class="item" v-for="(item,index) in 15" :key="item">
                            {{index}}、{{item}}
                        </div>
                        <pl-scroll-sticky class="item deep" top="0">
                            中间内容，固定在顶部
                        </pl-scroll-sticky>
                        <div class="item" v-for="(item,index) in 15" :key="item">
                            {{index}}、{{item}}
                        </div>
                    </div>
                </pl-scroll>
            </div>
        </demo-row>

        <demo-row title="距离顶部有一定的距离">
            <div class="demo-sticky-container">
                <pl-scroll scrollX fitHostWidth>
                    <div class="list">
                        <pl-scroll-sticky class="item light" :top="0">
                            距离顶部0px
                        </pl-scroll-sticky>
                        <div class="item" v-for="(item,index) in 15" :key="item">
                            {{index}}、{{item}}
                        </div>
                        <pl-scroll-sticky class="item deep" :top="30">
                            距离顶部30px
                        </pl-scroll-sticky>
                        <div class="item" v-for="(item,index) in 15" :key="item">
                            {{index}}、{{item}}
                        </div>
                    </div>
                </pl-scroll>
            </div>
        </demo-row>

        <demo-row title="固定在底部">
            <div class="demo-sticky-container">
                <pl-scroll scrollX fitHostWidth>
                    <div class="list">
                        <div class="item" v-for="(item,index) in 15" :key="item">
                            {{index}}、{{item}}
                        </div>
                        <pl-scroll-sticky class="item light" :bottom="30" :zIndex="2">
                            距离底部30px
                        </pl-scroll-sticky>
                        <div class="item" v-for="(item,index) in 15" :key="item">
                            {{index}}、{{item}}
                        </div>
                        <pl-scroll-sticky class="item deep" :bottom="0">
                            距离底部0px
                        </pl-scroll-sticky>
                    </div>
                </pl-scroll>
            </div>
        </demo-row>

        <demo-row title="固定在左侧">
            <div class="demo-sticky-container">
                <pl-scroll scrollX fitHostWidth fitHostHeight>
                    <div class="list horizontal">
                        <pl-scroll-sticky class="item light" :left="0">
                            距离左侧0px
                        </pl-scroll-sticky>
                        <div class="item" v-for="(item,index) in 15" :key="item">
                            {{index}}、{{item}}
                        </div>
                        <pl-scroll-sticky class="item deep" :left="80" :zIndex="2">
                            距离左侧80px
                        </pl-scroll-sticky>
                        <div class="item" v-for="(item,index) in 15" :key="item">
                            {{index}}、{{item}}
                        </div>
                    </div>
                </pl-scroll>
            </div>
        </demo-row>

        <demo-row title="固定在右侧">
            <div class="demo-sticky-container">
                <pl-scroll scrollX fitHostWidth fitHostHeight>
                    <div class="list horizontal">
                        <div class="item" v-for="(item,index) in 15" :key="item">
                            {{index}}、{{item}}
                        </div>
                        <pl-scroll-sticky class="item deep" :right="80" :zIndex="2">
                            距离右侧80px
                        </pl-scroll-sticky>
                        <div class="item" v-for="(item,index) in 15" :key="item">
                            {{index}}、{{item}}
                        </div>
                        <pl-scroll-sticky class="item light" :right="0">
                            距离右侧0px
                        </pl-scroll-sticky>
                    </div>
                </pl-scroll>
            </div>
        </demo-row>

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
        height: 200px;

        .list {

            &:not(.horizontal) {
                .item {
                    font-size: 12px;
                    padding: 0 16px;
                    margin-bottom: 1px;
                    background-color: #f2f2f2;
                    height: 30px;
                    display: flex;
                    align-items: center;
                }
            }

            &.horizontal {
                align-items: stretch;
                height: 100%;
                flex-wrap: nowrap;
                display: inline-flex;

                .item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 80px;
                    background-color: #f2f2f2;
                    margin-right: 1px;
                }
            }

            .item {
                &.deep {
                    background-color: #12b4a5;
                    color: white;
                }

                &.light {
                    background-color: #99a9bf;
                    color: white;
                }
            }
        }
    }
</style>