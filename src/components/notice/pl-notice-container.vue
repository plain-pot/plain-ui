<template>
    <div class="pl-notice-container">
        <pl-list direction="right">
            <pl-notice-service v-for="option in options" :key="option.id" :option="option" @close="close(option)"/>
        </pl-list>
    </div>
</template>

<script>
    import PlNoticeService from "./pl-notice-service";

    export default {
        name: "pl-notice-container",
        components: {PlNoticeService},
        data() {
            return {
                options: [],
            }
        },
        methods: {
            newService(message, option) {
                if (typeof message === 'object') {
                    option = message
                } else {
                    option = option || {}
                    option.message = String(message)
                }

                if (option.status === undefined) {
                    option.status = 'primary'
                }

                if (!option.id) {
                    option.id = this.$plain.utils.uuid()
                }
                this.options.push(option)
                option.close = () => this.close(option)
                return option
            },
            close(option) {
                let index = this.options.findIndex(item => item.id === option.id)
                if (index !== -1) {
                    this.options.splice(index, 1)
                }
            },
        },
    }
</script>

<style lang="scss">

</style>