<template>
    <div class="demo-progress">
        <demo-row title="条形进度条">
            <demo-line title="基本用法">
                <pl-progress-bar :modelValue="65"/>
            </demo-line>
            <demo-line title="宽高">
                <pl-progress-bar :modelValue="65" width="100px" height="3px"/>
            </demo-line>
            <demo-line title="颜色">
                <pl-progress-bar :modelValue="65" innerColor="blueviolet" outerColor="#ddd"/>
            </demo-line>
            <demo-line title="状态">
                <pl-progress-bar :modelValue="65" status="success"/>
                <pl-progress-bar :modelValue="65" status="error"/>
            </demo-line>
            <demo-line title="状态颜色">
                <pl-progress-bar :modelValue="65" status="success" successColor="green"/>
                <pl-progress-bar :modelValue="65" status="error" errorColor="red"/>
            </demo-line>
        </demo-row>

        <demo-row title="条形进度条：内联文字">
            <demo-line title="基本用法">
                <pl-progress-bar :modelValue="65" inlineText/>
            </demo-line>
            <demo-line title="宽高(高度不可修改)" width="150px">
                <pl-progress-bar :modelValue="65" width="100px" height="3px" inlineText/>
            </demo-line>
            <demo-line title="颜色">
                <pl-progress-bar :modelValue="65" innerColor="blueviolet" outerColor="#ddd" inlineText/>
            </demo-line>
            <demo-line title="状态">
                <pl-progress-bar :modelValue="65" status="success" inlineText/>
                <pl-progress-bar :modelValue="65" status="error" inlineText/>
            </demo-line>
            <demo-line title="状态颜色">
                <pl-progress-bar :modelValue="65" status="success" successColor="green" inlineText/>
                <pl-progress-bar :modelValue="65" status="error" errorColor="red" inlineText/>
            </demo-line>
        </demo-row>

        <demo-row title="环形进度条">
            <demo-line title="基本用法">
                <pl-progress-circle :modelValue="65"/>
            </demo-line>
            <demo-line title="大小">
                <pl-progress-circle :modelValue="65" :size="80"/>
            </demo-line>
            <demo-line title="线宽">
                <pl-progress-circle :modelValue="65" :lineSize="3"/>
            </demo-line>
            <demo-line title="起始角度">
                <pl-progress-circle :modelValue="65" :startAngle="0.5*Math.PI"/>
            </demo-line>

            <demo-line title="颜色">
                <pl-progress-circle :modelValue="65" innerColor="blueviolet" outerColor="#ddd"/>
            </demo-line>
            <demo-line title="状态">
                <pl-progress-circle :modelValue="65" status="success"/>
                <pl-progress-circle :modelValue="65" status="error"/>
            </demo-line>
            <demo-line title="状态颜色">
                <pl-progress-circle :modelValue="65" status="success" successColor="green"/>
                <pl-progress-circle :modelValue="65" status="error" errorColor="red"/>
            </demo-line>

        </demo-row>

        <demo-row title="迷你进度条">
            <demo-line title="基本用法">
                <pl-progress-mini :modelValue="65"/>
            </demo-line>
            <demo-line title="大小">
                <pl-progress-mini :modelValue="65" :size="80"/>
            </demo-line>
            <demo-line title="颜色">
                <pl-progress-mini :modelValue="65" innerColor="blueviolet" outerColor="#ddd"/>
            </demo-line>
            <demo-line title="状态">
                <pl-progress-mini :modelValue="65" status="success"/>
                <pl-progress-mini :modelValue="65" status="error"/>
            </demo-line>
            <demo-line title="状态颜色">
                <pl-progress-mini :modelValue="65" status="success" successColor="green"/>
                <pl-progress-mini :modelValue="65" status="error" errorColor="red"/>
            </demo-line>
        </demo-row>

        <demo-row title="数据绑定">
            <div>
                <pl-slider v-model="val"/>
            </div>
            <pl-progress-bar :modelValue="val"/>
            <pl-progress-bar :modelValue="val" inlineText/>
            <pl-progress-circle :modelValue="val"/>
            <pl-progress-mini type="mini" :modelValue="val"/>
        </demo-row>

        <!--<demo-row title="自定义颜色">
            <pl-progress innerColor="blueviolet" outerColor="#ddd" :modelValue="30"/>
        </demo-row>
        <demo-row title="状态">
            <pl-progress :modelValue="100" status="success"/>
            <pl-progress :modelValue="25" status="error"/>
        </demo-row>
        <demo-row title="内部文字">
            <pl-progress inlineText :modelValue="30"/>
            <pl-progress inlineText :modelValue="10"/>
            <pl-progress inlineText :modelValue="100" status="success"/>
            <pl-progress inlineText :modelValue="10" status="error"/>
        </demo-row>
        <demo-row title="圆形进度条">
            <pl-progress type="circle" :modelValue="80"/>
            <pl-progress type="circle" :modelValue="80" innerColor="blueviolet" outerColor="#ddd"/>
            <pl-progress type="circle" :modelValue="100" status="success"/>
            <pl-progress type="circle" :modelValue="20" status="error"/>
        </demo-row>
        <demo-row title="测试数据绑定">
            <div>
                <pl-slider v-model="val"/>
            </div>
            <pl-progress :modelValue="val"/>
            <pl-progress :modelValue="val" inlineText/>
            <pl-progress :modelValue="val" type="circle"/>
            <pl-progress type="mini" :modelValue="val"/>
        </demo-row>-->

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
