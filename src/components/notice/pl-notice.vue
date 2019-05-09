<template>
    <div class="pl-notice"
         :class="[`pl-notice-color-${TYPE[type].color}`]" @click="()=>!!click && click()"
         @mouseenter="clearTimer"
         @mouseleave="resetTimer"
    >
        <div class="pl-notice-head" v-if="!noHeader">
            <div class="pl-notice-title">
                <pl-icon :icon="TYPE[type].icon"/>
                <span>{{title}}</span>
            </div>
            <pl-icon icon="pad-close-circle-fill" class="pl-notice-close-icon" @click="close" hover/>
        </div>
        <div class="pl-notice-body">
            <span v-if="!!message">{{message}}</span>
            <pl-render-func :render-func="renderFunc" v-if="!!renderFunc"/>
        </div>
    </div>
</template>

<script>

    import PlRenderFunc from "../render/pl-render-func";
    import PlIcon from "../pl-icon";

    export default {
        name: "pl-notice",
        components: {PlIcon, PlRenderFunc},
        props: {
            data: {},
            title: {type: String, default: '提示'},
            message: {type: String},
            type: {type: String},
            time: {type: Number},
            done: {type: Function},
            click: {type: Function},
            noHeader: {type: Boolean},
            renderFunc: {type: Function,},
        },
        created() {
            this.resetTimer()
        },
        data() {
            return {
                TYPE: this.$plain.TYPE,
                timer: null,
            }
        },
        methods: {
            close() {
                this.$emit('done')
            },
            resetTimer() {
                if (this.time != null) this.timer = setTimeout(() => {
                    this.$emit('done',)
                    !!this.done && (this.done())
                }, this.time)
            },
            clearTimer() {
                if (!!this.timer) {
                    clearTimeout(this.timer)
                    this.timer = null
                }
            },
        }
    }
</script>