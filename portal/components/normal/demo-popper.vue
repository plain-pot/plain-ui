<template>
    <div class="demo-popper">

        <div style="height: 500px;background-color: #3B731D;width: 100px"></div>
        <im-demo-row title="基本用法">
            <im-button label="show dom" @click="toggle" ref="button"/>
            <im-button label="destroy" @click="popper.destroy()"/>
            <im-input v-model="text"/>
            <div>
                <div class="box" ref="box">
                    <im-icon icon="pad-star"/>
                    <im-button label="close" @click="popper.hide()"/>
                    <im-input v-model="text"/>
                </div>
            </div>
        </im-demo-row>
        <div style="height: 500px;background-color: #226873;width: 100px"></div>
    </div>
</template>

<script>
    export default {
        name: "demo-popper",
        data() {
            return {
                popper: null,
                text: '123456',
                under: false
            }
        },
        methods: {
            async toggle() {
                if (!this.popper) this.popper = await this.$plain.$popper.newPopper({
                    reference: this.$refs.button,
                    popper: this.$refs.box,
                    direction: 'bottom',
                    align: 'start',
                    arrow: true,
                })
                this.popper.p_show ? this.popper.hide() : this.popper.show()
            },
        }
    }
</script>

<style lang="scss">
    .demo-popper {
        @at-root .box {
            /*background-color: #f2f2f2;*/
            height: 100px;
            width: 250px;
            padding: 12px;
            border-radius: 4px;
        }


    }

</style>