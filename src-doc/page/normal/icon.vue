<template>
    <div class="demo-icon">
        <demo-row title="使用 ElementUI 标准图标"/>
        <div class="demo-icon-list">
            <ul>
                <li v-for="item in icons" :key="item">
                    <p><i :class="`el-icon-${item}`"/></p>
                    <span>el-icon-{{item}}</span>
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
            }
        },
        methods: {},
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

                & > p {
                    font-size: 24px;
                    color: #606266;
                }

                & > span {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 50px;


                    font-size: 12px;
                    word-break: break-word;
                    width: 100%;
                    padding: 0 16px;
                    text-align: center;
                    color: #99a9bf;
                }
            }
        }
    }

    @include themify {
        .demo-icon-list {
            li {
                transition: all 300ms linear;
                &:hover {
                    cursor: pointer;
                    background-color: rgba($colorPrimary, 0.1);

                    span, p {
                        color: $colorPrimary;
                    }
                }
            }
        }
    }
</style>