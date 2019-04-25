<template>
    <div class="demo-test">
        <im-demo-row title="测试函数绑定">
            <im-radio :value="disabled.insertable" label="insertable"/>
            <im-radio :value="disabled.updateable" label="updateable"/>
        </im-demo-row>
        <im-demo-row>
            <im-radio v-model="option.insertable" label="active1"/>
            <im-radio v-model="option.updatebale" label="active2"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-test",
        data() {
            return {
                active1: true,
                active2: false,
                option: {
                    insertable: true,
                    updatebale: false,
                    enable() {
                        return {
                            insertable: this.option.insertable,
                            updateable: this.option.updatebale,
                        }
                    },
                }
            }
        },
        computed: {
            disabled() {
                console.log('disabled calculate')
                const ret = this.option.enable.apply(this)
                return ret
            },
        },
    }
</script>

<style lang="scss">

</style>