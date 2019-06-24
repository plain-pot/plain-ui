<template>
    <div class="demo-radio">
        <im-demo-row title="基本用法">
            <im-radio v-model="val1"/><span>hello</span>
            <im-button @click="val1=!val1" label="button"/>
        </im-demo-row>
        <im-demo-row title="设置真假值">
            <im-button>val4:{{val4}}</im-button>
            <im-radio v-model="val4" true-value="Y" false-value="N"/>
        </im-demo-row>
        <im-demo-row title="颜色">
            <im-radio v-for="(color,index) in colors" :key="index" :color="color" v-model="val1"/>
        </im-demo-row>
        <im-demo-row title="大小">
            <im-demo-row-item title="large">
                <im-radio v-for="(color,index) in colors" :key="index" :color="color" v-model="val1" size="large"/>
            </im-demo-row-item>
            <im-demo-row-item title="default">
                <im-radio v-for="(color,index) in colors" :key="index" :color="color" v-model="val1" size="default"/>
            </im-demo-row-item>
            <im-demo-row-item title="small">
                <im-radio v-for="(color,index) in colors" :key="index" :color="color" v-model="val1" size="small"/>
            </im-demo-row-item>
        </im-demo-row>
        <im-demo-row title="设置文本">
            <im-radio v-for="(color,index) in colors" :key="index" :color="color" v-model="val1" :label="color"/>
        </im-demo-row>
        <im-demo-row title="禁用">
            <im-radio v-for="(color,index) in colors" :key="index" :color="color" v-model="val1" disabled/>
        </im-demo-row>
        <im-demo-row title="只读">
            <im-radio v-for="(color,index) in colors" :key="index" :color="color" v-model="val1" readonly/>
        </im-demo-row>
        <im-demo-row title="设置激活icon与未激活icon">
            <im-radio v-for="(color,index) in colors" :key="index" :color="color" v-model="val1" active-icon="pad-star-fill" inactive-icon="pad-star"/>
        </im-demo-row>
        <im-demo-row title="设置激活颜色与未激活颜色">
            <im-radio active-color="#7109AA" inactive-color="#009999"/>
        </im-demo-row>
        <im-demo-row title="组">
            <im-demo-row-item title="默认单选">
                <im-radio-group v-model="val2">
                    <im-radio v-for="(color,index) in colors" :key="index" :color="color" :id="color" :label="color"/>
                </im-radio-group>
                <im-button>val2:{{val2}}</im-button>
            </im-demo-row-item>
            <im-demo-row-item title="多选">
                <im-radio-group v-model="val3" multiple>
                    <im-radio v-for="(color,index) in colors" :key="index" :color="color" :id="color" :label="color"/>
                </im-radio-group>
                <im-button>val3:{{val3}}</im-button>
            </im-demo-row-item>
            <im-demo-row-item title="纵向多选">
                <im-radio-group v-model="val3" multiple vertical>
                    <im-radio v-for="(color,index) in colors" :key="index" :color="color" :id="color" :label="color"/>
                </im-radio-group>
                <im-button>val3:{{val3}}</im-button>
            </im-demo-row-item>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-radio",
        data() {
            return {
                colors: ['primary', 'success', 'warn', 'error', 'info'],
                val1: true,
                val2: 'error',
                val3: ['primary'],
                val4: 'Y',
            }
        },
        mounted() {
            console.log('demo radio mounted')
        },
        destroyed() {
            console.log('demo radio destroyed')
        },
    }
</script>

<style lang="scss">

</style>