<template>
    <div class="demo-plain-dom">
        <im-demo-row>
            <im-button label="toggle" @click="under = !under"/>
            <div v-plain-dom="under" :class="{'fixed-box':under}">
                <im-input v-model="text"/>
            </div>
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
    export default {
        name: "demo-plain-dom",
        data() {
            return {
                text: null,
                under: false,

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