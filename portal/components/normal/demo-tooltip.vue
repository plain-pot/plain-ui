<template>
    <div class="demo-tooltip">
        <!--<im-demo-row title="提示内容">
            <im-input v-model="input"/>
        </im-demo-row>
        <im-demo-row title="基本用法">
            <span v-im-tooltip="input">基本用法</span>
        </im-demo-row>
        <im-demo-row title="带箭头">
            <im-button v-im-tooltip="{content:input,arrow:true}" label="带箭头提示框"/>
        </im-demo-row>
        <im-demo-row title="方向位置">
            <im-button-group>
                <im-button v-im-tooltip="{content:input,placement:'top'}" label="上"/>
                <im-button v-im-tooltip="{content:input,placement:'bottom'}" label="下"/>
                <im-button v-im-tooltip="{content:input,placement:'right'}" label="右"/>
                <im-button v-im-tooltip="{content:input,placement:'left'}" label="左"/>
            </im-button-group>
        </im-demo-row>
        <im-demo-row title="触发的方式">
            <im-button v-im-tooltip="{content:input,trigger:'click'}" label="click"/>
            <im-button v-im-tooltip="{content:input,trigger:'focus'}" label="focus"/>
            <im-button v-im-tooltip="{content:input,trigger:'mouseenter'}" label="mouseenter"/>
            <im-button v-im-tooltip="{content:input,trigger:'manual'}" label="manual"/>
        </im-demo-row>
        <im-demo-row title="其他更多配置参考Tippy.js"/>-->
        <im-demo-row title="tooltip-text组件，超长省略号显示并且鼠标悬浮时tooltip显示">
            <im-demo-row-item title="基本用法">
                <im-tooltip :content="tooltipText"/>
            </im-demo-row-item>
            <div class="demo-tooltip-box">
                <im-tooltip content="tooltip-text组件，超长省略号显示并且鼠标悬浮时tooltip显示" showOverflowTooltip/>
            </div>
            <div class="demo-tooltip-box">
                <im-tooltip :content="tooltipText" showOverflowTooltip/>
            </div>
            <div>
                <im-input v-model="tooltipText"/>
            </div>
        </im-demo-row>
    </div>
</template>

<script>


    export default {
        name: "demo-tooltip",
        data() {
            return {
                input: '这把不亏',
                tooltipText: '非超长文本'
            }
        },
    }
</script>

<style lang="scss">
    .demo-tooltip {
        .demo-tooltip-box {
            width: 150px;
            background-color: #5c677b;
            color: white;
            &:not(:last-child) {
                margin-bottom: 12px;
            }
        }
    }
</style>