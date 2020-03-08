<template>
    <div class="pl-message-item"
         :class="[`pl-message-item-status-${STATUS[status].status || 'primary'}`]" @click="pl_click">
        <div class="pl-message-item-content">
            <pl-icon :icon="icon || STATUS[status].icon" class="pl-message-item-icon"/>
            <span>{{p_message}}</span>
        </div>
        <pl-icon icon="el-icon-close" class="pl-message-item-close" @click.stop="close"/>
    </div>
</template>

<script>

    import {PropsMixin} from "../../utils/mixins";

    export default {
        name: "pl-message-item",
        mixins: [PropsMixin({
            message: {type: String, check: PropsMixin.Promise},
        })],
        props: {
            status: {type: String},
            icon: {type: String},
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
                STATUS: this.$plain.STATUS,
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