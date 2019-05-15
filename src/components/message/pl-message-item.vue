<template>
    <div class="pl-message-item"
         :class="[`pl-message-item-color-${TYPE[type].color}`]" @click="pl_click">
        <div>
            <pl-icon :icon="TYPE[type].icon" class="pl-message-item-icon"/>
            <span>{{text}}</span>
        </div>
        <pl-icon icon="pad-close" class="pl-message-item-close" @click.stop="close"/>
    </div>
</template>

<script>

    import PlIcon from "../pl-icon";

    export default {
        name: "pl-message-item",
        components: {PlIcon},
        props: {
            text: {},
            type: {type: String},
            time: {type: Number},
            done: {type: Function},
            click: {type: Function},
        },
        created() {
            if (this.time !== null) this.timer = setTimeout(() => {
                this.close()
                !!this.done && (this.done())
            }, this.time)
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
            pl_click(e) {
                !!this.click && this.click(e)
            },
        },
    }
</script>