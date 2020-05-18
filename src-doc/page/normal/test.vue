<script>
    import {onMounted} from "@vue/composition-api";
    import {useRefs} from "../../../src/use/useRefs";

    export default {
        name: "test",
        setup(props, context) {
            const input = useRefs()

            onMounted(() => {
                console.log(input.value)
            })

            return () => (
                <div>
                    <pl-input refer={input}/>
                    [{!!input.value ? input.value.model : 'no input'}]
                </div>
            )
        },
    }
</script>

<style lang="scss">
</style>