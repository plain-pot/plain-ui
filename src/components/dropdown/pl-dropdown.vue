<script>
    export default {
        name: "pl-dropdown",
        props: {

        },
        data() {
            return {}
        },
        computed: {
            dropdownItems() {
                return this.$slots
            },
        },
        render() {
            return this.$slots.default[0]
        },
        methods: {
            log() {
                console.log(this.dropdownItems)
            },
        },
    }
</script>

<style lang="scss">
</style>