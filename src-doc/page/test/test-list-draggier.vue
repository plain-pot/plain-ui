<template>
    <div class="test-list-draggier">
        test-list-draggier
    </div>
</template>

<script>
    import {useListDraggier} from "../../../src/packages/table/plc-components/standard/draggier/use-list-draggier";

    export default {
        name: "test-list-draggier",
        setup() {

            const {} = useListDraggier()

            return {}
        },
    }
</script>

<style lang="scss">

</style>