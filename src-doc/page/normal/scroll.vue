<template>
    <div class="demo-scroll">
        <demo-row title="基本用法1">
            <div class="demo-scroll-wrapper" style="display: inline-block;vertical-align: top">
                <pl-scroll>
                    <div>
                        <div class="demo-scroll-label" v-for="(item) in list" :key="item">{{item}}</div>
                    </div>
                </pl-scroll>
            </div>
            <pl-button-group>
                <pl-button icon="el-icon-circle-plus-outline" @click="list.push(list.length+1)"/>
                <pl-button icon="el-icon-remove-outline" @click="list.shift()"/>
            </pl-button-group>
        </demo-row>
        <demo-row title="基本用法2">
            <div class="demo-scroll-wrapper">
                <pl-scroll>
                    <div style="height: 400px;width: 400px;" class="demo-scroll-content">
                        this is content
                    </div>
                </pl-scroll>
            </div>
        </demo-row>
        <demo-row title="可横向滚动">
            <div class="demo-scroll-wrapper">
                <pl-scroll scrollX>
                    <div style="height: 400px;width: 400px;" class="demo-scroll-content">
                        this is content
                    </div>
                </pl-scroll>
            </div>
        </demo-row>
        <demo-row title="只能横向滚动">
            <div class="demo-scroll-wrapper">
                <pl-scroll scrollX :scrollY="false">
                    <div style="height: 400px;width: 400px;" class="demo-scroll-content">
                        this is content
                    </div>
                </pl-scroll>
            </div>
        </demo-row>
        <demo-row title="适配内容高度">
            <div class="demo-scroll-wrapper" style="height: auto">
                <pl-scroll scrollX fitContentHeight>
                    <div style="height: 400px;width: 400px;" class="demo-scroll-content">
                        this is content
                    </div>
                </pl-scroll>
            </div>
        </demo-row>
        <demo-row title="适配内容宽度">
            <div class="demo-scroll-wrapper" style="width: auto">
                <pl-scroll fitContentWidth>
                    <div style="height: 400px;width: 400px;" class="demo-scroll-content">
                        this is content
                    </div>
                </pl-scroll>
            </div>
        </demo-row>
        <demo-row title="适配host高度">
            <div class="demo-scroll-wrapper">
                <pl-scroll fitHostHeight scrollX>
                    <div style="height: 100%;width: 400px;" class="demo-scroll-content">
                        this is content
                    </div>
                </pl-scroll>
            </div>
        </demo-row>
        <demo-row title="适配host宽度">
            <div class="demo-scroll-wrapper">
                <pl-scroll fitHostWidth>
                    <div style="height: 400px;width: 100%;" class="demo-scroll-content">
                        this is content
                    </div>
                </pl-scroll>
            </div>
        </demo-row>

        <demo-row title="滚动：纵向">
            <div class="demo-scroll-wrapper">
                <pl-scroll ref="scroll">
                    <div style="height: 400px;width: 400px;" class="demo-scroll-content">
                        this is content
                        <div>
                            <p>
                                <pl-button label="scroll" @click="$refs.scroll.scroll({y:100},1000)"/>
                            </p>
                            <p>
                                <pl-button label="scrollEnd" @click="$refs.scroll.scrollEnd()"/>
                            </p>
                        </div>
                    </div>
                </pl-scroll>
            </div>
        </demo-row>
        <demo-row title="滚动：横向">
            <div class="demo-scroll-wrapper">
                <pl-scroll ref="scroll" scrollX>
                    <div style="height: 400px;width: 400px;" class="demo-scroll-content">
                        this is content
                        <div>
                            <p>
                                <pl-button label="scroll" @click="$refs.scroll.scroll({x:100},1000)"/>
                            </p>
                            <p>
                                <pl-button label="scrollEnd" @click="$refs.scroll.scrollEnd()"/>
                            </p>
                        </div>
                    </div>
                </pl-scroll>
            </div>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-scroll",
        props: {},
        data() {
            return {
                list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            }
        },
    }
</script>

<style lang="scss">
    .demo-scroll {
        .demo-scroll-wrapper {
            background-color: #f6f6f6;
            height: 198px;
            width: 91px;
            display: inline-block;
        }

        .demo-scroll-content {
            height: 400px;
            width: 400px;
            display: inline-block;
        }

        .demo-scroll-label {
            /*margin: 50px 0;*/
        }
    }
</style>