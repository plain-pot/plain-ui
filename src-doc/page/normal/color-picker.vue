<template>
    <div class="color-picker">
        <demo-row title="颜色面板:基本用法">
            <demo-line>{{color1}}</demo-line>
            <demo-line>
                <pl-color-panel v-model="color1" format="hex"/>
            </demo-line>
        </demo-row>
        <demo-row title="颜色面板：透明度">
            <demo-line>{{color2}}</demo-line>
            <demo-line>
                <pl-color-panel v-model="color2" enableAlpha format="hex"/>
            </demo-line>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "color-picker",
        props: {},
        data() {
            return {
                color1: '#218379',
                color2: null,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>