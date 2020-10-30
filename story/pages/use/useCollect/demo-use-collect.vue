<template>
    <div class="demo-use-collect">

        <h1>单独使用</h1>
        <div>
            <demo-use-collect-child-component v-model="showFlag">
                isShow:{{String(showFlag)}}
            </demo-use-collect-child-component>
        </div>
        <h1>真假值</h1>
        <div>
            <demo-use-collect-child-component v-model="showFlag2" :trueValue="10" :falseValue="20">
                isShow:{{showFlag2}}
            </demo-use-collect-child-component>
        </div>
        <h1>选项组</h1>
        <demo-use-collect-parent-component v-model="selected">
            <demo-use-collect-child-component label="选项一" val="one"/>
            <demo-use-collect-child-component label="选项二" val="two"/>
            <demo-use-collect-child-component label="选项三" val="three"/>
        </demo-use-collect-parent-component>
        <div>
            {{selected}}
        </div>

        <demo-use-collect-parent-component v-model="selected">
            <demo-use-collect-child-component label="选项一" val="one"/>
            <demo-use-collect-child-component label="选项二" val="two"/>
            <demo-use-collect-child-component label="选项三" val="three"/>
        </demo-use-collect-parent-component>
    </div>
</template>

<script>

    import {DemoUseCollectParentComponent} from "./demo-use-collect-parent";
    import {DemoUseCollectChildComponent} from "./demo-use-collect-child";

    export default {
        name: "demo-use-collect",
        components: {
            DemoUseCollectParentComponent,
            DemoUseCollectChildComponent,
        },
        data() {
            return {
                selected: [],
                showFlag: false,
                showFlag2: null,
            }
        },
    }
</script>

<style lang="scss">
    @include theme {
        .demo-use-collect-child {
            background-color: white;
            border: solid 1px $ibc;
            color: $itc;
            outline: none;
            padding: 6px 16px;
            cursor: pointer;
            min-width: 200px;

            & + .demo-use-collect-child {
                margin-left: 10px;
            }

            &:hover {
                background-color: mix($colorPrimary, white, 10%);
            }

            &.demo-use-collect-child-checked {
                background-color: $colorPrimary;
                color: white;
                border-color: $colorPrimary;

                &:hover {
                    background-color: mix(black, $colorPrimary, 10%);
                }
            }
        }

        .demo-use-collect-child-minus {
            &.demo-use-collect-child-minus-status-check {
                background-color: $colorPrimary;
                color: white;
                border-color: $colorPrimary;

                &:hover {
                    background-color: mix(black, $colorPrimary, 10%);
                }
            }

            &.demo-use-collect-child-minus-status-uncheck {
            }

            &.demo-use-collect-child-minus-status-minus {
                border-color: $colorPrimary;
                color: $colorPrimary;
            }
        }
    }
</style>