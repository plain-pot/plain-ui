<template>
    <div class="demo-popper">
        <im-demo-row>
            <im-button label="toggle" @click="under = !under"/>
            <div v-plain-dom="under" :class="{'fixed-box':under}">
                <im-input v-model="text"/>
            </div>
            <im-input v-model="text" color="primary"/>

        </im-demo-row>
        <!--<div style="height: 500px;background-color: #3B731D;width: 100px"></div>
        <im-demo-row title="基本用法">
            <im-button label="show dom" @click="toggle" ref="button"/>
            <div style="visibility: hidden">
                <div class="box" ref="box">
                    <im-icon icon="pad-star"/>
                    <im-button label="close" @click="popper.hide()"/>
                </div>
            </div>
        </im-demo-row>
        <div style="height: 500px;background-color: #226873;width: 100px"></div>-->
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
                    direction: 'left',
                    align: 'start'
                })
                this.popper.p_show ? this.popper.hide() : this.popper.show()
            },
        }
    }
</script>

<style lang="scss">
    .demo-popper {
        @at-root .box {
            background-color: #f2f2f2;
            height: 100px;
            width: 250px;
            padding: 12px;
            border-radius: 4px;
        }

        @at-root .fixed-box {
            background-color: #f2f2f2;
            height: 100px;
            width: 250px;
            padding: 12px;
            border-radius: 4px;
            top: 300px;
            left: 300px;
            position: fixed;
        }
    }

</style>