<template>
    <div class="demo-progress">
        <im-demo-row title="条形进度条">
            <im-demo-row-item title="基本用法">
                <im-progress-bar :value="65"/>
            </im-demo-row-item>
            <im-demo-row-item title="宽高">
                <im-progress-bar :value="65" width="100px" height="3px"/>
            </im-demo-row-item>
            <im-demo-row-item title="颜色">
                <im-progress-bar :value="65" innerColor="blueviolet" outerColor="#ddd"/>
            </im-demo-row-item>
            <im-demo-row-item title="状态">
                <im-progress-bar :value="65" status="success"/>
                <im-progress-bar :value="65" status="error"/>
            </im-demo-row-item>
            <im-demo-row-item title="状态颜色">
                <im-progress-bar :value="65" status="success" successColor="green"/>
                <im-progress-bar :value="65" status="error" errorColor="red"/>
            </im-demo-row-item>
        </im-demo-row>

        <im-demo-row title="条形进度条：内联文字">
            <im-demo-row-item title="基本用法">
                <im-progress-bar :value="65" inlineText/>
            </im-demo-row-item>
            <im-demo-row-item title="宽高(高度不可修改)" width="150px">
                <im-progress-bar :value="65" width="100px" height="3px" inlineText/>
            </im-demo-row-item>
            <im-demo-row-item title="颜色">
                <im-progress-bar :value="65" innerColor="blueviolet" outerColor="#ddd" inlineText/>
            </im-demo-row-item>
            <im-demo-row-item title="状态">
                <im-progress-bar :value="65" status="success" inlineText/>
                <im-progress-bar :value="65" status="error" inlineText/>
            </im-demo-row-item>
            <im-demo-row-item title="状态颜色">
                <im-progress-bar :value="65" status="success" successColor="green" inlineText/>
                <im-progress-bar :value="65" status="error" errorColor="red" inlineText/>
            </im-demo-row-item>
        </im-demo-row>

        <im-demo-row title="环形进度条">
            <im-demo-row-item title="基本用法">
                <im-progress-circle :value="65"/>
            </im-demo-row-item>
            <im-demo-row-item title="大小">
                <im-progress-circle :value="65" :size="80"/>
            </im-demo-row-item>
            <im-demo-row-item title="线宽">
                <im-progress-circle :value="65" :lineSize="3"/>
            </im-demo-row-item>
            <im-demo-row-item title="起始角度">
                <im-progress-circle :value="65" :startAngle="0.5*Math.PI"/>
            </im-demo-row-item>

            <im-demo-row-item title="颜色">
                <im-progress-circle :value="65" innerColor="blueviolet" outerColor="#ddd"/>
            </im-demo-row-item>
            <im-demo-row-item title="状态">
                <im-progress-circle :value="65" status="success"/>
                <im-progress-circle :value="65" status="error"/>
            </im-demo-row-item>
            <im-demo-row-item title="状态颜色">
                <im-progress-circle :value="65" status="success" successColor="green"/>
                <im-progress-circle :value="65" status="error" errorColor="red"/>
            </im-demo-row-item>

        </im-demo-row>

        <im-demo-row title="迷你进度条">
            <im-demo-row-item title="基本用法">
                <im-progress-mini :value="65"/>
            </im-demo-row-item>
            <im-demo-row-item title="大小">
                <im-progress-mini :value="65" :size="80"/>
            </im-demo-row-item>
            <im-demo-row-item title="颜色">
                <im-progress-mini :value="65" innerColor="blueviolet" outerColor="#ddd"/>
            </im-demo-row-item>
            <im-demo-row-item title="状态">
                <im-progress-mini :value="65" status="success"/>
                <im-progress-mini :value="65" status="error"/>
            </im-demo-row-item>
            <im-demo-row-item title="状态颜色">
                <im-progress-mini :value="65" status="success" successColor="green"/>
                <im-progress-mini :value="65" status="error" errorColor="red"/>
            </im-demo-row-item>
        </im-demo-row>

        <im-demo-row title="数据绑定">
            <div>
                <im-slider v-model="val"/>
            </div>
            <im-progress-bar :value="val"/>
            <im-progress-bar :value="val" inlineText/>
            <im-progress-circle :value="val"/>
            <im-progress-mini type="mini" :value="val"/>
        </im-demo-row>

        <!--<im-demo-row title="自定义颜色">
            <im-progress innerColor="blueviolet" outerColor="#ddd" :value="30"/>
        </im-demo-row>
        <im-demo-row title="状态">
            <im-progress :value="100" status="success"/>
            <im-progress :value="25" status="error"/>
        </im-demo-row>
        <im-demo-row title="内部文字">
            <im-progress inlineText :value="30"/>
            <im-progress inlineText :value="10"/>
            <im-progress inlineText :value="100" status="success"/>
            <im-progress inlineText :value="10" status="error"/>
        </im-demo-row>
        <im-demo-row title="圆形进度条">
            <im-progress type="circle" :value="80"/>
            <im-progress type="circle" :value="80" innerColor="blueviolet" outerColor="#ddd"/>
            <im-progress type="circle" :value="100" status="success"/>
            <im-progress type="circle" :value="20" status="error"/>
        </im-demo-row>
        <im-demo-row title="测试数据绑定">
            <div>
                <im-slider v-model="val"/>
            </div>
            <im-progress :value="val"/>
            <im-progress :value="val" inlineText/>
            <im-progress :value="val" type="circle"/>
            <im-progress type="mini" :value="val"/>
        </im-demo-row>-->

    </div>
</template>

<script>
    export default {
        name: "demo-progress",
        data() {
            return {
                val: 73,
            }
        },
    }
</script>

<style lang="scss">
</style>
