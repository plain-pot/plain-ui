<template>
    <div class="color-picker">
        <demo-row title="ColorAlphaSlider">
            <pl-color-alpha-slider v-model="val[0]" color="black" size="180"/>
            {{val[0]}}
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
                },
            }
        },
    }
</script>

<style lang="scss">

</style>