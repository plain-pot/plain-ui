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
            .item {
                font-size: 12px;
                padding: 0 16px;
                margin-bottom: 1px;
                background-color: #f2f2f2;
                height: 30px;
                display: flex;
                align-items: center;

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