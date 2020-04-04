<template>
    <div class="pl-color-panel">
        <pl-color-sv-panel height="180" width="240" :hue="hue"/>
        <pl-color-hue-slider size="240" v-model="hue"/>
        <!--        <pl-color-alpha-slider size="240"/>-->
    </div>
</template>

<script>
    import PlColorSvPanel from "./sub/pl-color-sv-panel";
    import PlColorHueSlider from "./sub/pl-color-hue-slider";
    import PlColorAlphaSlider from "./sub/pl-color-alpha-slider";

    export default {
        name: "pl-color-panel",
        components: {PlColorAlphaSlider, PlColorHueSlider, PlColorSvPanel},
        props: {},
        data() {
            return {
                hue: 0,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
    @include themify{
        .pl-color-panel {
            display: inline-block;
            font-size: 0;

            .pl-color-hue-slider {
                margin-top: 8px;
            }
        }
    }
</style>