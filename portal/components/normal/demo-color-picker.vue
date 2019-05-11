<template>
    <div class="demo-color-picker">
        <im-demo-row title="颜色选择面板：启用透明度">
            <pl-color-picker-panel v-model="val" enable-alpha/>
        </im-demo-row>
        <im-demo-row title="颜色选择面板：未启用透明度">
            <pl-color-picker-panel v-model="val"/>
        </im-demo-row>

        <im-demo-row title="颜色选择器：启用透明度">
            <im-color-picker v-model="rgbValue" enable-alpha/>
            <im-color-picker v-model="rgbValue" enable-alpha/>
        </im-demo-row>

        <im-demo-row title="颜色选择器：未启用透明度">
            <im-color-picker v-model="hexVal"/>
            <im-color-picker v-model="hexVal"/>
        </im-demo-row>
        <im-demo-row title="只读">
            <im-color-picker v-model="hexVal" readonly/>
        </im-demo-row>
        <im-demo-row title="禁用">
            <im-color-picker v-model="hexVal" disabled/>
        </im-demo-row>
        <im-demo-row title="支持设置盒子样式">
            <im-color-picker v-model="hexVal" :input="{shape:'round'}"/>
            <im-color-picker v-model="hexVal" :input="{shape:'round',type:'fill',color:'success'}"/>
        </im-demo-row>
    </div>
</template>

<script>

    import PlColorPickerPanel from "../../../src/components/color-picker/pl-color-picker-panel";

    export default {
        name: "demo-color-picker",
        components: {PlColorPickerPanel},
        data() {
            return {
                val: 'rgba(161,40,79,0.87)',
                hexVal: '#C73636',
                rgbValue: 'rgba(25,10,245,0.72)',
            }
        },
        mounted() {
        },
    }
</script>

<style lang="scss">
    .demo-color-picker {
        .box {
            width: 300px;
            height: 30px;
        }

        .hue {
            background: linear-gradient(90deg, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red);
        }

        .hsl {
            background-color: hsl(360, 100%, 40%);
        }
    }

</style>