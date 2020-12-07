<template>
    <div class="demo-scroll">
        <demo-row title="基本用法1">
            <div class="demo-scroll-wrapper" style="display: inline-block;vertical-align: top">
                <pl-scroll>
                    <div>
                        <div class="demo-scroll-label" v-for="(item) in list" :key="item" :class="getClass(item)">
                            {{item}}
                        </div>
                    </div>
                </pl-scroll>
            </div>
            <pl-button-group vertical>
                <pl-button icon="el-icon-circle-plus-outline" @click="list.push(list.length+1)" label="添加元素"/>
                <pl-button icon="el-icon-remove-outline" @click="list.shift()" label="删除元素"/>
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
        <demo-row title="基本用法3">
            <div class="demo-scroll-wrapper" style="display: inline-block;vertical-align: top">
                <pl-scroll>
                    <pl-checkbox-group v-model="checkboxValue">
                        <pl-list direction="top">
                            <pl-item class="demo-scroll-label" v-for="(item) in list" :key="item">
                                <pl-checkbox :val="String(item)"/>
                                {{item}}
                            </pl-item>
                        </pl-list>
                    </pl-checkbox-group>
                </pl-scroll>
            </div>
            <pl-button-group vertical>
                <pl-button icon="el-icon-circle-plus-outline" @click="list.push(list.length+1)" label="添加元素"/>
                <pl-button icon="el-icon-remove-outline" @click="list.shift()" label="删除元素"/>
            </pl-button-group>
            checkboxValue：{{checkboxValue}}
        </demo-row>
        <demo-row title="可横向滚动">
            <div class="demo-scroll-wrapper">
                <pl-scroll scrollX scrollAfterDragEnd>
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
                <pl-scroll ref="scroll1" @scroll="log('vertical scroll')">
                    <div style="height: 400px;width: 400px;" class="demo-scroll-content">
                        this is content
                        <div>
                            <p>
                                <pl-button size="mini" label="scroll" @click="$refs.scroll1.methods.scroll({y:100},1000)"/>
                            </p>
                            <p>
                                <pl-button size="mini" label="scroll(no emit)" @click="$refs.scroll1.methods.scroll({y:100},{time:1000,noEmitScroll:true})"/>
                            </p>
                            <p>
                                <pl-button size="mini" label="scrollEnd" @click="$refs.scroll1.methods.scrollEnd()"/>
                            </p>
                        </div>
                    </div>
                </pl-scroll>
            </div>
        </demo-row>
        <demo-row title="滚动：横向">
            <div class="demo-scroll-wrapper">
                <pl-scroll ref="scroll2" scrollX @scroll="log('vertical scroll')">
                    <div style="height: 400px;width: 400px;" class="demo-scroll-content">
                        this is content
                        <div>
                            <p>
                                <pl-button size="mini" label="scroll" @click="$refs.scroll2.methods.scroll({x:100},1000)"/>
                            </p>
                            <p>
                                <pl-button size="mini" label="scroll(no emit)" @click="$refs.scroll2.methods.scroll({x:100},{time:1000,noEmitScroll:true})"/>
                            </p>
                            <p>
                                <pl-button size="mini" label="scrollEnd" @click="$refs.scroll2.methods.scrollEnd()"/>
                            </p>
                        </div>
                    </div>
                </pl-scroll>
            </div>
        </demo-row>

        <demo-row title="自动滚动(纵向)">
            <div class="demo-scroll-wrapper" style="display: inline-block;vertical-align: top">
                <pl-scroll ref="autoScroll1">
                    <div>
                        <div class="demo-scroll-label" v-for="(item) in 100" :key="item">{{item}}</div>
                    </div>
                </pl-scroll>
            </div>
            <div style="display: inline-block;">
                <pl-button-group vertical>
                    <pl-button @click="$refs.autoScroll1.methods.autoScrollBottom()">向下滚动</pl-button>
                    <pl-button @click="$refs.autoScroll1.methods.autoScrollTop()">向上滚动</pl-button>
                    <pl-button @click="$refs.autoScroll1.methods.stopAutoScroll()">停止滚动</pl-button>
                </pl-button-group>
            </div>
        </demo-row>
        <demo-row title="自动滚动（横向）">
            <div class="demo-scroll-wrapper" style="display: inline-block;vertical-align: top">
                <pl-scroll ref="autoScroll2" scrollX>
                    <div style="display: inline-block;white-space: nowrap;">
                        <div class="demo-scroll-label" v-for="(item) in 12" :key="item" style="width: 30px;display: inline-block;margin-right: 10px">
                            {{item}}
                        </div>
                    </div>
                </pl-scroll>
            </div>
            <div style="display: inline-block;">
                <pl-button-group vertical>
                    <pl-button @click="$refs.autoScroll2.methods.autoScrollLeft()">向左滚动</pl-button>
                    <pl-button @click="$refs.autoScroll2.methods.autoScrollRight()">向右滚动</pl-button>
                    <pl-button @click="$refs.autoScroll2.methods.stopAutoScroll()">停止滚动</pl-button>
                </pl-button-group>
            </div>
        </demo-row>
        <demo-row title="scrollAfterDragEnd: 拖拽结束后滚动">
            <div class="demo-scroll-wrapper">
                <pl-scroll scrollX scrollAfterDragEnd>
                    <div style="height: 400px;width: 400px;" class="demo-scroll-content">
                        this is content
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
                checkboxValue: [],
                list: (() => {
                    let ret = []
                    let i = 0;
                    while (i < 40) {
                        ret.push(i++)
                    }
                    return ret
                })(),
            }
        },
        methods: {
            getClass(item) {
                console.log('item', item)
                return {}
            },
            log(...args) {
                console.log(...args)
            },
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
            padding: 8px 16px;
            border-bottom: solid 1px white;
            font-size: 12px;
            box-sizing: border-box;
        }
    }
</style>