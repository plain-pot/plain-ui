<template>
    <div class="test-svg">
        <demo-row>
            <div class="wrapper">
                wrapper
                <div class="plain-triangle arrow-left" left></div>
                <div class="plain-triangle arrow-right" right></div>
            </div>
        </demo-row>

        <demo-row title="triangle">
            <div class="plain-triangle" left></div>
            <div class="plain-triangle" right></div>
            <div class="plain-triangle" top></div>
            <div class="plain-triangle" bottom></div>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "test-svg",
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
    .test-svg {

        $color: #12b4a5;

        .plain-triangle {
            width: 0;
            height: 0;
            border: solid 40px transparent;
            display: inline-block;

            &[top] {
                border-top-width: 0;
                border-bottom-color: $color;
            }

            &[bottom] {
                border-bottom-width: 0;
                border-top-color: $color;
            }

            &[left] {
                border-left-width: 0;
                border-right-color: $color;
            }

            &[right] {
                border-right-width: 0;
                border-left-color: $color;
            }
        }

        .wrapper {
            width: 300px;
            height: 80px;
            background-color: #12b4a5;
            color: white;
            display: inline-flex;
            align-items: center;
            padding: 0 16px;
            box-sizing: border-box;
            position: relative;
            box-shadow: 0 0 16px 0 #12b4a5;


            .arrow-left, .arrow-right {
                position: absolute;
            }

            .arrow-left {
                border-right-color: $color;
                right: 100%;
            }

            .arrow-right {
                border-left-color: $color;
                left: 100%;
            }
        }
    }
</style>