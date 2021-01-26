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

        <demo-row :title="list.title" v-for="(list,index) in fontColor" :key="index">
            <div class="doc-theme-font-color-list">
                <div class="doc-theme-font-color-item" v-for="item in list.data" :key="item.clz">
                    <div :class="item.clz">{{item.desc}}</div>
                    <div>.{{item.clz}}</div>
                </div>
            </div>
        </demo-row>

        <demo-row :title="statusBackground.title">
            <div class="doc-theme-background-color-list doc-theme-background-status">
                <div class="doc-theme-font-color-item" v-for="item in statusBackground.data" :key="item.clz" :class="item.clz">
                    <div>
                        <span>{{item.desc}}</span>
                        <span>.{{item.clz}}</span>
                    </div>
                    <div></div>
                </div>
            </div>
        </demo-row>

        <demo-row :title="disabledBackgroundColor.title">
            <div class="doc-theme-background-color-list doc-theme-background-status doc-theme-background-disabled">
                <div class="doc-theme-font-color-item" v-for="item in disabledBackgroundColor.data" :key="item.clz" :class="item.clz">
                    <div>
                        <span>{{item.desc}}</span>
                        <span>.{{item.clz}}</span>
                    </div>
                    <div></div>
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
                statusBackground: {
                    title: '状态背景色',
                    data: [
                        {desc: '基础背景', clz: 'pl-background-primary'},
                        {desc: '成功背景', clz: 'pl-background-success'},
                        {desc: '警告背景', clz: 'pl-background-warn'},
                        {desc: '危险背景', clz: 'pl-background-error'},
                        {desc: '提示背景', clz: 'pl-background-info'},
                    ],
                },
                disabledBackgroundColor: {
                    title: '禁用背景色',
                    data: [
                        {desc: '禁用背景', clz: 'pl-background-disabled'},
                        {desc: '禁用背景(轻)', clz: 'pl-background-disabled-light'},
                        {desc: '禁用背景(深)', clz: 'pl-background-disabled-deep'},
                    ],
                },
                fontColor: [
                    {
                        title: '状态字体色',
                        data: [
                            {desc: '基础文字', clz: 'pl-text-primary'},
                            {desc: '成功文字', clz: 'pl-text-success'},
                            {desc: '警告文字', clz: 'pl-text-warn'},
                            {desc: '危险文字', clz: 'pl-text-error'},
                            {desc: '提示文字', clz: 'pl-text-info'},
                        ],
                    },
                    {
                        title: '其他字体色',
                        data: [
                            {desc: '正文', clz: 'pl-text-color'},
                            {desc: '正文(轻)', clz: 'pl-text-color-light'},
                            {desc: '标题', clz: 'pl-title-color'},
                            {desc: '占位符', clz: 'pl-placeholder-color'},
                            {desc: '图标', clz: 'pl-icon-color'},
                            {desc: '禁用文字', clz: 'pl-background-disabled-text'},
                        ],
                    },
                ],
            }
        },
    }
</script>

<style lang="scss">
    @include theme {

        .doc-theme-font-color-item {
            display: inline-block;
            width: 150px;
            margin-right: 8px;

            &, & > * {
                box-sizing: border-box;
            }

            div:first-child {
                padding: 12px 20px;
                font-size: 18px;
                border: solid 1px $ibl;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
            }

            div:last-child {
                background-color: $ibl;
                padding: 12px 20px;
                color: $itl;
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        /*文字颜色*/
        .doc-theme-font-color-list {
        }
        /*背景色*/
        .doc-theme-background-status {
            .doc-theme-font-color-item {
                width: 180px;
                border-radius: 4px;

                div:first-child {
                    border: none;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;

                    & > span:last-child {
                        font-size: 12px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }

                div:last-child {
                    background-color: transparent;
                    position: relative;

                    &:before {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 50%;
                        bottom: 0;
                        background-color: rgba(white, 0.5);
                        content: '';
                    }

                    &:after {
                        position: absolute;
                        top: 0;
                        right: 0;
                        left: 50%;
                        bottom: 0;
                        background-color: rgba(white, 0.85);
                        content: '';
                    }
                }
            }
        }
        /*禁用色*/
        .doc-theme-background-disabled {
            .doc-theme-font-color-item {
                &:not(:last-child) {
                    border: solid 1px $ibc;
                }

                & > div {
                    & > span:first-child {
                        color: $ihc;
                    }

                    & > span:last-child {
                        color: $itc;
                    }
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