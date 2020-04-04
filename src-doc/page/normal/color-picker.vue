<template>
    <div class="color-picker">
        <demo-row title="基本用法">
            <demo-line>
                <pl-color-panel v-model="color1" enableAlpha format="hex"/>
            </demo-line>
            <demo-line>
                <pl-color-panel v-model="color2" format="hex"/>
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