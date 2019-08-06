<template>
    <div class="pl-progress">
        <pl-progress-circle v-if="type === 'circle'"
                            ref="circle"
                            v-bind="publicBinding"/>
        <pl-progress-bar v-if="type === 'bar'"
                         ref="bar"
                         v-bind="publicBinding"/>
        <pl-progress-mini v-if="type === 'mini'"
                         ref="bar"
                         v-bind="publicBinding"/>
    </div>
</template>

<script>
    import PlProgressCircle from "./pl-progress-circle";
    import PlProgressBar from "./pl-progress-bar";
    import PlProgressMini from "./pl-progress-mini";

    export default {
        name: "pl-progress",
        components: {PlProgressMini, PlProgressBar, PlProgressCircle},
        props: {
            value: {type: Number, default: 100},
            type: {type: String, default: 'bar'},
            outerColor: {type: String, default: '#f2f2f2'},
            innerColor: {type: String, default: '#12b4a5'},
            speed: {type: Number, default: 3},
            status: {type: String, default: 'normal'},
            successColor: {type: String, default: '#42E67F'},
            errorColor: {type: String, default: '#FF6235'},
            inlineText: {type: Boolean},
        },
        computed: {
            publicBinding() {
                return {
                    value: this.value,
                    outerColor: this.outerColor,
                    innerColor: this.innerColor,
                    speed: this.speed,
                    status: this.status,
                    successColor: this.successColor,
                    errorColor: this.errorColor,
                    inlineText: this.inlineText,
                }
            },
        },
        methods: {
            reload() {
                this.$refs[this.type].reload()
            },
        },
    }
</script>
