<template>
    <div class="pl-progress">
        <pl-progress-circle v-if="type === 'circle'"
                            ref="circle"
                            v-bind="publicBinding"/>
        <pl-progress-bar v-if="type === 'bar'"
                         ref="bar"
                         v-bind="publicBinding"/>
    </div>
</template>

<script>
    import PlProgressCircle from "./pl-progress-circle";
    import PlProgressBar from "./pl-progress-bar";

    export default {
        name: "pl-progress",
        components: {PlProgressBar, PlProgressCircle},
        props: {
            value: {type: Number, default: 100},
            type: {type: String, default: 'bar'},
            outerColor: {type: String, default: '#f2f2f2'},
            innerColor: {type: String, default: '#42E67F'},
            speed: {type: Number, default: 3},
        },
        computed: {
            publicBinding() {
                return {
                    value: this.value,
                    outerColor: this.outerColor,
                    innerColor: this.innerColor,
                    speed: this.speed,
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