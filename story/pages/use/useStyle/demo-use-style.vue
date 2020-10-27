<template>
    <div class="demo-use-style">

        <demo-use-style-parent>
            <demo-use-style-child/>
            <demo-use-style-child/>
            <demo-use-style-child/>
        </demo-use-style-parent>

        <demo-use-style-parent status="error">
            <demo-use-style-child/>
            <demo-use-style-child/>
            <demo-use-style-child/>
        </demo-use-style-parent>

        <demo-use-style-parent>
            <demo-use-style-child status="error"/>
            <demo-use-style-child/>
            <demo-use-style-child/>
        </demo-use-style-parent>

        <demo-use-style-parent status="warn">
            <demo-use-style-child status="success"/>
            <demo-use-style-child/>
            <demo-use-style-child/>
        </demo-use-style-parent>
    </div>
</template>

<script>

    import {DemoUseStyleParent} from "./demo-use-style-parent";
    import {DemoUseStyleChild} from "./demo-use-style-child";

    export default {
        name: "demo-use-style",
        components: {
            DemoUseStyleParent,
            DemoUseStyleChild,
        },
    }
</script>

<style lang="scss">
    @include theme {
        .pl-use-style-parent {
            padding: 20px;
            margin: 10px 0;
            @include statusMixin(use-style-parent) {
                background-color: mix($value, white, 20%);
            }
        }

        .pl-use-style-child {
            padding: 8px;
            margin: 8px 0;
            @include statusMixin(use-style-child) {
                background-color: $value;
                color: white;
            }
        }
    }
</style>