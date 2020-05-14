<script>
    import {useRef} from "../../../src/util/use";
    import {onMounted} from "@vue/composition-api";

    export default {
        name: "test",
        setup(props, context) {
            const input = useRef()

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