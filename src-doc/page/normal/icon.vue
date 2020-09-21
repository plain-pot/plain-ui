<template>
    <div class="demo-icon">
        <demo-row title="基本用法">
            <pl-icon icon="el-icon-delete-solid"/>
            <pl-icon icon="el-icon-delete-solid" status="error"/>
        </demo-row>
        <demo-row title="iconfont svg">
            <pl-icon icon="plicon-gitee"/>
        </demo-row>
        <demo-row title="iconfotn font class">
            <pl-icon icon="pli-git"/>
        </demo-row>
        <demo-row title="使用 ElementUI 标准图标">
            <div style="text-align: center">
                <pl-input suffixIcon="el-icon-search" size="large" shape="round" :width="500" @keydown.enter="onEnter" v-model="searchValue" @click-suffix-icon="onEnter"/>
            </div>
        </demo-row>
        <div class="demo-icon-list">
            <ul>
                <li v-for="item in targetIcons" :key="item" @click="onClickItem(item)">
                    <p><i :class="`el-icon-${item}`"/></p>
                    <div>el-icon-{{item}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

    import icons from '../../lib/icon.json'

    export default {
        name: "demo-icon",
        props: {},
        data() {
            return {
                icons,
                searchValue: null,
                targetSearchValue: null,
            }
        },
        computed: {
            targetIcons() {
                if (!this.targetSearchValue) return this.icons
                return this.icons.filter(icon => `el-icon-${icon}`.indexOf(this.targetSearchValue) > -1)
            },
        },
        methods: {
            onEnter() {
                this.targetSearchValue = this.searchValue
            },
            onClickItem(item) {
                this.$plain.utils.copyToClipboard(`el-icon-${item}`, () => this.$message('已经复制到剪切板'))
            },
        },
    }
</script>

<style lang="scss">

    $border: solid 1px #f1f1f1;

    .demo-icon-list {
        width: 100%;
        display: flex;
        justify-content: center;

        ul {
            margin: 0;
            padding: 0;
            border-top: $border;
            border-left: $border;
            width: #{128*6+1}px;

            li {
                list-style: none;
                border-right: $border;
                border-bottom: $border;
                width: 128px;
                height: 172px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                position: relative;
                box-sizing: border-box;

                & > p {
                    font-size: 24px;
                    color: #606266;
                }

                & > div {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 50px;
                    display: block;
                    font-size: 12px;
                    word-break: break-word;
                    width: 100%;
                    padding: 0 16px;
                    text-align: center;
                    color: #99a9bf;
                    box-sizing: border-box;
                }
            }
        }
    }

    @include theme {
        .demo-icon-list {
            li {
                transition: all 300ms linear;

                &:hover {
                    cursor: pointer;
                    background-color: rgba($colorPrimary, 0.1);

                    div, p {
                        color: $colorPrimary;
                    }
                }
            }
        }
    }
</style>