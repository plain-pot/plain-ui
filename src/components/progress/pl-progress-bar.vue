<template>
    <div class="pl-progress-bar">
        <div class="pl-progress-bar-outer" :style="outerStyles">
            <div class="pl-progress-bar-inner" :style="innerStyles"></div>
        </div>
        <span class="pl-progress-bar-content">
            <pl-icon v-if="status === 'success'" icon="pad-check-circle-fill" class="pl-progress-bar-icon-success" :style="{color:successColor}"/>
            <pl-icon v-else-if="status === 'error'" icon="pad-close-circle-fill" class="pl-progress-bar-icon-error" :style="{color:iconColor}"/>
            <span v-else>{{value}}%</span>
        </span>
    </div>
</template>

<script>
    import PlIcon from "../pl-icon";

    export default {
        name: "pl-progress-bar",
        components: {PlIcon},
        props: {
            value: {type: Number},
            width: {type: String, default: '300px'},
            height: {type: String, default: '6px'},
            outerColor: {},
            innerColor: {},
            speed: {},
            status: {},
            successColor: {},
            errorColor: {},
        },
        computed: {
            iconColor() {
                switch (this.status) {
                    case 'success':
                        return this.successColor
                    case 'error':
                        return this.errorColor
                    default:
                        return null
                }
            },
            outerStyles() {
                return {
                    height: this.height,
                    width: this.width,
                    backgroundColor: this.outerColor,
                    borderRadius: this.width,
                }
            },
            innerStyles() {
                return {
                    width: `${this.value}%`,
                    backgroundColor: this.iconColor || this.innerColor,
                    borderRadius: this.width,
                }
            },
        },
    }
</script>