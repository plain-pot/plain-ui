<template>
    <div class="demo-plain-dom">
        <im-demo-row>
            <im-button label="UNDER" @click="under = !under"/>
            <im-button label="INIT" @click="init = !init"/>
            <pl-dom :value="under" v-if="init">
                <div :class="{'fixed-box':under}">
                    <im-input v-model="text"/>
                </div>
            </pl-dom>
            <im-input v-model="text" color="primary"/>

        </im-demo-row>
        <im-demo-row>
            <div>
                <im-button label="一" @click="move(1)"/>
                <im-input v-model="text1" ref="popper1" color="primary"/>
            </div>
            <div>
                <im-button label="二" @click="move(2)"/>
                <im-input v-model="text1" ref="popper2" color="success"/>
            </div>
            <div>
                <im-button label="三" @click="move(3)"/>
                <im-input v-model="text1" ref="popper3" color="error"/>
            </div>
            <div style="width: 300px;height: 100px;display: flex;align-items: center;justify-content: center;background-color: #f2f2f2" ref="container">

            </div>
        </im-demo-row>
    </div>
</template>

<script>
    import PlDom from "../../../src/components/pl-dom";

    export default {
        name: "demo-plain-dom",
        components: {PlDom},
        data() {
            return {
                text: null,
                under: false,
                init: true,

                text1: 'hello',
                parentNode: null,
                el: null,
                replace: document.createComment('replace')
            }
        },
        methods: {
            move(num) {
                if (!!this.el) {
                    console.log(111)
                    this.parentNode.replaceChild(this.el, this.replace)
                    console.log(this.parentNode)
                }

                this.el = this.getEL(this.$refs[`popper${num}`])
                this.parentNode = this.el.parentNode
                this.parentNode.replaceChild(this.replace, this.el)
                this.$refs.container.appendChild(this.el)
            },

            getEL(obj) {
                return obj.$el || obj
            },
        }
    }
</script>

<style lang="scss">
    .fixed-box {
        background-color: #f2f2f2;
        height: 100px;
        width: 250px;
        padding: 12px;
        border-radius: 4px;
        top: 300px;
        left: 300px;
        position: fixed;
    }
</style>