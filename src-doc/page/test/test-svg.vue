<template>
    <div class="test-svg">
        <demo-row>

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
            height: 60px;
            width: 300px;
            background-color: #f6f6f6;
            position: relative;

            .wrapper-top {
                height: 50%;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                background-color: #12b4a5;
            }

            .wrapper-bottom {

            }

        }
    }
</style>