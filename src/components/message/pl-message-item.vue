<template>
    <div class="pl-message-item"
         :class="[`pl-message-item-status-${STATUS[status].status}`]" @click="pl_click">
        <div class="pl-message-item-content">
            <pl-icon :icon="icon || STATUS[status].icon" class="pl-message-item-icon"/>
            <span>{{message}}</span>
        </div>
        <pl-icon icon="el-icon-close" class="pl-message-item-close" @click.stop="close"/>
    </div>
</template>

<script>

    export default {
        name: "pl-message-item",
        props: {
            message: {},
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