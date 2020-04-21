<template>
    <div class="pl-tab-vertical-group">
        pl-tab-vertical-group
    </div>
</template>

<script>
    import {TabMixin, TabProps} from "./tab";
    import {MountedMixin} from "../../utils/mixins";

    export default {
        name: "pl-tab-vertical-group",
        mixins: [
            TabMixin,
            MountedMixin,
        ],
        props: {
            ...TabProps,
        },
        data() {
            return {
                groupClass: 'pl-tab-vertical-group',
            }
        },
    }
</script>

<style lang="scss">

</style>