<template>
    <div class="demo-color">
        <!--<demo-row title="主题色">
            <div class="pl-block pl-block-shape-fillet" v-for="(item) in status" :key="item" :class="`pl-block-status-${item.status}`">
                {{item.name}}
            </div>
        </demo-row>
        <demo-row title="主题在线切换">
            <div class="pl-block pl-block-shape-fillet" v-for="item in ['default','blue','violet']" :key="item" :class="`pl-block-${item}`" @click="()=>$plain.changeTheme(item)">
                {{item}}
            </div>
        </demo-row>

        <demo-row title="局部主题">
            <demo-line v-for="theme in ['default','blue','violet']" :class="theme?`theme-${theme}`:''" :title="theme" :key="theme">
                <div class="pl-block pl-block-shape-fillet" v-for="(item) in status" :key="item" :class="`pl-block-status-${item.status}`">
                    {{item.name}}
                </div>
            </demo-line>
        </demo-row>-->

        <demo-row title="字体颜色">
            <div class="doc-theme-font-color-list">
                <div v-for="(list,index) in fontColor" :key="index">
                    <div class="doc-theme-font-color-item pl-border-color pl-border-radius-fillet" v-for="item in list" :key="item.clz">
                        <div :class="item.clz">{{item.desc}}</div>
                        <div>.{{item.clz}}</div>
                    </div>
                </div>
            </div>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "color",
        data() {
            return {
                status: [
                    {name: '基础', status: 'primary'},
                    {name: '成功', status: 'success'},
                    {name: '警告', status: 'warn'},
                    {name: '错误', status: 'error'},
                    {name: '帮助', status: 'info'},
                ],
                backgroundColor:[
                    [

                    ],
                ],
                fontColor: [
                    [
                        {desc: '基础文字', clz: 'pl-text-primary'},
                        {desc: '成功文字', clz: 'pl-text-success'},
                        {desc: '警告文字', clz: 'pl-text-warn'},
                        {desc: '危险文字', clz: 'pl-text-error'},
                        {desc: '提示文字', clz: 'pl-text-info'},
                    ],
                    [
                        {desc: '正文', clz: 'pl-text-color'},
                        {desc: '正文(轻)', clz: 'pl-text-color-light'},
                        {desc: '标题', clz: 'pl-title-color'},
                        {desc: '占位符', clz: 'pl-placeholder-color'},
                        {desc: '图标', clz: 'pl-icon-color'},
                    ],
                ],
            }
        },
    }
</script>

<style lang="scss">
    @include theme {

        /*文字颜色*/
        .doc-theme-font-color-list {
            & > div {
                margin-bottom: 8px;

                & > div {
                    margin-right: 8px;
                }
            }

            .doc-theme-font-color-item {
                display: inline-block;
                border-style: solid;
                border-width: 1px;
                width: 150px;

                div:first-child {
                    padding: 4px 9px;
                    font-size: 20px;
                }

                div:last-child {
                    background-color: $ibl;
                    border-top: solid 1px $ibc;
                    padding: 4px 9px;
                    color: $itl;
                    font-size: 12px;
                }
            }
        }


        .pl-block {
            height: 40px;
            width: 90px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: white;
            margin-right: 16px;

            @include statusMixin(block) {
                background-color: $value;
                box-shadow: 0 16px 46px 0 rgba($value, 0.5);
            }
            @include shapeMixin(block) {
                border-radius: $value;
            }

            &.pl-block-default {
                cursor: pointer;
                background-color: #12b4a5;
                box-shadow: 0 16px 46px 0 rgba(#12b4a5, 0.5);
            }

            &.pl-block-blue {
                cursor: pointer;
                background-color: #3E97EC;
                box-shadow: 0 16px 46px 0 rgba(#3E97EC, 0.5);
            }

            &.pl-block-violet {
                cursor: pointer;
                background-color: blueviolet;
                box-shadow: 0 16px 46px 0 rgba(blueviolet, 0.5);
            }
        }
    }
</style>