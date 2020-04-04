<template>
    <div class="pl-color-panel">
        <pl-color-sv-panel/>
        <pl-color-hue-slider/>
        <pl-color-alpha-slider/>
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
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>