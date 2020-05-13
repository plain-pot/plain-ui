<template>
    <div class="demo-slider">
        <demo-row :title="'基本用法'+val0">
            <pl-slider v-model="val0"/>
        </demo-row>
        <demo-row :title="'横向纵向，以及对其方式'+val1">
            <pl-slider vertical v-model="val1"/>
            <pl-slider vertical align-end v-model="val1" @input="val=>$plain.log(val)"/>
            <pl-slider v-model="val1"/>
            <pl-slider v-model="val1" align-end/>
        </demo-row>
        <demo-row title="状态">
            <pl-slider v-model="val1" status="primary"/>
            <pl-slider v-model="val1" status="success"/>
            <pl-slider v-model="val1" status="warn"/>
            <pl-slider v-model="val1" status="error"/>
            <pl-slider v-model="val1" status="info"/>
        </demo-row>
        <demo-row :title="'设置总数'+val3">
            <pl-slider v-model="val3" :total="1000"/>
        </demo-row>
        <demo-row :title="'设置滑块宽度'+val4">
            <pl-slider v-model="val4" length="100px"/>
            <pl-slider v-model="val4" length="200px"/>
            <pl-slider v-model="val4" length="300px"/>
            <pl-slider v-model="val4" full/>
        </demo-row>
        <demo-row title="范围选择">
            <pl-slider range :start.sync="start" :end.sync="end" :total="200" length="300px"/>
            <pl-button>start:{{start}}</pl-button>
            <pl-button>end:{{end}}</pl-button>
        </demo-row>
        <demo-row title="禁用tooltip">
            <pl-slider :tooltip="false"></pl-slider>
        </demo-row>
        <demo-row title="格式化tooltip">
            <pl-slider :tooltipFormatter="val=>val+'%'"></pl-slider>
        </demo-row>
        <demo-row title="设置最大最小值">
            <pl-slider :value="50" :max="80" :min="40"/>
            <pl-slider range :start="60" :end="90" :max="150" :min="50" :total="200"/>
        </demo-row>
        <demo-row title="步骤分块">
            <pl-slider :value="50" :step="10"/>
            <pl-slider range length="300px" :step="10" :start.sync="start" :end.sync="end" :total="200"/>
        </demo-row>
        <demo-row title="禁用只读">
            <demo-line>
                <pl-toggle v-model="val[0]"/>
            </demo-line>
            <demo-line>
                <pl-slider :value="50" :disabled="val[0]"/>
                <pl-slider :value="50" :readonly="val[0]"/>
            </demo-line>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-slider",
        data() {
            return {
                val:{
                    0: true,
                },
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