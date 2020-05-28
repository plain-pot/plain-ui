<template>
    <div class="test-svg">
        <demo-row>
            <div class="wrapper">
                wrapper
                <div class="arrow-left"></div>
                <div class="arrow-right"></div>
            </div>
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
                width: 0;
                height: 0;
                border: 40px solid transparent;
                position: absolute;
            }

            .arrow-left {
                border-right-color: #12b4a5;
                border-left-width: 0;
                right: 100%;
            }

            .arrow-right {
                border-left-color: #12b4a5;
                border-right-width: 0;
                left: 100%;
            }
        }
    }
</style>