<template>
    <div class="color-picker">
        <demo-row title="ColorAlphaSlider">
            <pl-color-alpha-slider v-model="val[0]" color="black" size="180"/>
            {{val[0]}}
        </demo-row>
        <demo-row title="ColorHueSlider">
            <pl-color-hue-slider v-model="val[1]" size="240"/>
            {{val[1]}}
        </demo-row>
        <demo-row title="ColorPanel:基本用法">
            <div :style="`background-color:${color1};width:100px;height:30px`">
                {{color1}}
            </div>
            <pl-color-panel v-model="color1" format="hex"/>
        </demo-row>
        <demo-row title="ColorPanel:透明度">
            <div :style="`background-color:${color2};width:100px;height:30px`">
                {{color2}}
            </div>
            <demo-line>
                <demo-line>{{color2}}</demo-line>
                <demo-line>
                    <pl-color-panel v-model="color2" enableAlpha format="rgb"/>
                </demo-line>
            </demo-line>
        </demo-row>
    </div>
</template>

<script>

    export default {
        name: "color-picker",
        data() {
            return {
                val: {
                    0: 50,
                    1: 240,
                },
                color1: '#ee2356',
                color2: null,
            }
        },
    }
</script>

<style lang="scss">

</style>