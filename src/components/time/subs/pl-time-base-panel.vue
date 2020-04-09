<script>
    export default {
        name: "pl-time-base-panel",
        props: {
            layout: {type: Array, default: () => (['h', 'm', 's'])},
        },
        data() {
            return {}
        },
        render(h) {

            let layout = {
                h: <pl-time-base-column layout="h"/>,
                m: <pl-time-base-column layout="m"/>,
                s: <pl-time-base-column layout="s"/>,
            }
            const content = this.layout.map(i => layout[i])

            return (
                <div class="pl-time-base-panel">
                    {content}
                </div>
            )
        },
        methods: {},
    }
</script>

<style lang="scss">
    @include themify {
        .pl-time-base-panel {
            border: solid $ibc 1px;
            border-radius: 4px;
            display: inline-block;
            position: relative;
            color: $itc;

            $item_height: 24px;

            &:before {
                position: absolute;
                top: $item_height*3;
                left: 0;
                right: 0;
                height: 1px;
                background-color: rgba($ibc, 0.5);
                content: '';
                pointer-events: none;
            }

            &:after {
                position: absolute;
                bottom: $item_height*3 + 3;
                left: 0;
                right: 0;
                height: 1px;
                background-color: rgba($ibc, 0.5);
                content: '';
                pointer-events: none;
            }

            .pl-time-base-column {
                border: none;

                & + .pl-time-base-column {
                    border-left: solid 1px rgba($ibc, 0.5);
                }
            }
        }
    }
</style>