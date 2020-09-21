<template>
    <div class="demo-popper">

        <demo-row title="动画">
            <pl-popper transition="pl-transition-fade" trigger="click">
                <pl-button label="fade"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
            <pl-popper transition="pl-transition-scale" trigger="click">
                <pl-button label="scale"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
            <pl-popper transition="pl-transition-scale-y" trigger="click">
                <pl-button label="scale-y"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
            <pl-popper transition="pl-transition-popper-drop" trigger="click" :arrow="false" placement="bottom-start">
                <pl-button label="popper-drop"/>
                <div slot="popper" class="demo-popper-content">
                    这里是popper的内容
                </div>
            </pl-popper>
        </demo-row>

    </div>
</template>

<script>
    import DemoMixins from "../../component/DemoMixins";

    export default {
        name: "demo-popper",
        mixins: [DemoMixins],
        props: {},
        data() {
            return {
                init: false,
                reference: null,
                flag: false,
                open: false,

                test: {
                    show: true,
                    direction: 'bottom',
                    align: 'start',
                    arrow: false,
                    animation: 'pl-transition-popper-drop',
                },
                directions: ['top', 'bottom', 'left', 'right'],
                aligns: ['start', 'center', 'end'],
                animations: [
                    'pl-transition-fade',
                    'pl-transition-scale',
                    'pl-transition-scale-y',
                    'pl-transition-popper-drop',
                ],
            }
        },
        mounted() {
            this.reference = this.$refs.button
        },
        methods: {
            onClickBody() {
                console.log('onClickBody')
            },
        },
    }
</script>

<style lang="scss">
    .demo-popper-placement {
        .app-demo-row-content {
            width: 420px;
        }

        .r-button {
            margin-bottom: 12px;
            height: 80px !important;
            width: 80px;
        }
    }
</style>