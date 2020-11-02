<template>
    <div class="demo-icon">
        <div style="font-size: 40px;color: #4caf50">
            <span>普通的文本：NORMAL normal</span>
            <pl-icon icon="el-icon-alarm-clock"/>
            <pl-icon icon="el-icon-arrow-down"/>
        </div>
        <button @click="showFlag = true">
            应用图标
            <pl-icon icon="el-icon-bottom" v-if="showFlag"/>
        </button>
        <h4>自定义图标</h4>
        <pl-icon icon="my-icon-yes"/>

        <h4>图标状态</h4>
        <pl-icon style="font-size: 40px" icon="el-icon-search" v-for="item in ['primary','success','error','warn','info']" :key="item" :status="item"/>

        <h4>所有图标</h4>
        <ul class="icon-list">
            <li v-for="item in icons" :key="item" class="icon-item">
                <div @click="onClickItem(item)">
                    <pl-icon :icon="item"/>
                </div>
                <div>
                    {{item}}
                </div>
                <div>
                    <div @click="onClickItem(item)">
                        <pl-icon icon="el-icon-folder"/>
                    </div>
                    <div @click="onClickItem(item,true)">
                        <pl-icon icon="el-icon-folder-s"/>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

    import icons from 'src/packages/icon/icons/index.json'
    import {copyToClipboard} from "../../../src/utils/copyToClipboard";

    export default {
        name: "icon.vue",
        data() {
            return {
                showFlag: false,
                icons,
            }
        },
        methods: {
            onClickItem(item, isComponent) {
                copyToClipboard(isComponent ? `<pl-icon icon="${item}"/>` : item)
            },
        },
    }
</script>

<style lang="scss">
    .demo-icon {
        .icon-list {
            list-style: none;
            margin: 0;
            padding: 0;

            .icon-item {
                display: inline-block;
                width: 180px;
                border: solid 1px #f2f2f2;
                margin: 10px;
                vertical-align: top;
                cursor: pointer;
                user-select: none;

                & > div:first-child {
                    height: 60px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-bottom: solid 1px #f2f2f2;
                    font-size: 32px;

                    &:hover {
                        background-color: #f6f4ff;
                    }
                }

                & > div:nth-child(2) {
                    border-bottom: solid 1px #f2f2f2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 40px;
                    white-space: nowrap;
                }

                & > div:last-child {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    & > div {
                        flex: 1;
                        color: #eee;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 28px;

                        &:hover {
                            background-color: #f6f4ff;
                        }

                        &:first-child {
                            border-right: solid 1px #f2f2f2;
                        }
                    }
                }
            }
        }
    }
</style>