<script>
    import {onMounted} from "@vue/composition-api";
    import {useRefs} from "../../../src/use/useRefs";

    export default {
        name: "test",
        setup(props, context) {

            return () => (
                <div>
                    <pl-input />

                </div>
            )
        },
    }
</script>

<style lang="scss">
</style>