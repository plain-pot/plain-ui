<template>
    <div class="demo-slider">
        <im-demo-row :title="'基本用法'+val0">
            <im-slider v-model="val0"/>
        </im-demo-row>
        <im-demo-row :title="'横向纵向，以及对其方式'+val1">
            <im-slider vertical v-model="val1"/>
            <im-slider vertical align-end v-model="val1"/>
            <im-slider v-model="val1"/>
            <im-slider v-model="val1" align-end/>
        </im-demo-row>
        <im-demo-row title="颜色">
            <im-slider v-model="val1" color="primary"/>
            <im-slider v-model="val1" color="success"/>
            <im-slider v-model="val1" color="warn"/>
            <im-slider v-model="val1" color="error"/>
            <im-slider v-model="val1" color="info"/>
        </im-demo-row>
        <im-demo-row :title="'设置总数'+val3">
            <im-slider v-model="val3" :total="1000"/>
        </im-demo-row>
        <im-demo-row :title="'设置滑块宽度'+val4">
            <im-slider v-model="val4" length="100px"/>
            <im-slider v-model="val4" length="200px"/>
            <im-slider v-model="val4" length="300px"/>
            <im-slider v-model="val4" full/>
        </im-demo-row>
        <im-demo-row title="范围选择">
            <im-slider range :start.sync="start" :end.sync="end" :total="200" length="300px"/>
            <im-button>start:{{start}}</im-button>
            <im-button>end:{{end}}</im-button>
        </im-demo-row>
        <im-demo-row title="禁用tooltip">
            <im-slider :tooltip="false"></im-slider>
        </im-demo-row>
        <im-demo-row title="格式化tooltip">
            <im-slider :tooltipFormatter="val=>val+'%'"></im-slider>
        </im-demo-row>
        <im-demo-row title="设置最大最小值">
            <im-slider :value="50" :max="80" :min="40"/>
            <im-slider range :start="60" :end="90" :max="150" :min="50" :total="200"/>
        </im-demo-row>
        <im-demo-row title="步骤分块">
            <im-slider :value="50" :step="10"/>
            <im-slider range length="300px" :step="10" :start.sync="start" :end.sync="end" :total="200"/>
        </im-demo-row>
        <im-demo-row title="禁用">
            <im-slider :value="50" disabled/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-slider",
        data() {
            return {
                val0: 40,
                val1: 20,
                val2: 10,
                val3: 200,
                val4: 20,
                start: 20,
                end: 40,
            }
        },
    }
</script>

<style lang="scss">

</style>