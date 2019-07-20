<template>
    <div class="pl-container">
        <div class="pl-container-left-outer" v-if="!!$slots.leftOuter">
            <slot name="leftOuter"></slot>
        </div>
        <div class="pl-container-center">
            <div class="pl-container-head">
                <slot name="head"></slot>
            </div>
            <div class="pl-container-content">
                <div class="pl-container-content-left">
                    <slot name="left"></slot>
                </div>
                <div class="pl-container-content-center">
                    <slot></slot>
                </div>
                <div class="pl-container-content-right">
                    <slot name="right"></slot>
                </div>
            </div>
            <div class="pl-container-foot">
                <slot name="foot"></slot>
            </div>
        </div>
        <div class="pl-container-right-outer" v-if="!!$slots.rightOuter">
            <slot name="rightOuter"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pl-container",
        props: {},
    }
</script>

<style lang="scss">

    .pl-container {
        height: 100%;
        width: 100%;
    }

    .pl-container, .pl-container-center, .pl-container-content {
        display: flex;
        align-items: stretch;
    }

    .pl-container-center, .pl-container-content, .pl-container-content-center {
        flex: 1;
    }

    .pl-container-center, .pl-container-content-center {
        flex-direction: column;
    }

    .pl-container-content {
        flex-direction: row;
    }

    .pl-container-left-outer, .pl-container-right-outer, .pl-container-content-left, .pl-container-content-right {
        & > div {
            height: 100%;
            display: block;
            overflow: auto;
        }
    }

    .pl-container-head, .pl-container-foot {
        & > div {
            width: 100%;
            display: block;
            overflow: auto;
        }
    }

    .pl-container-content-center {
        & > div {
            display: block;
            width: 100%;
            height: 100%;
            overflow: auto;
        }
    }

</style>
