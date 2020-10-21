<template>
    <div class="demo-button" :class="classes">
        {{classes}}
        <pl-input ref="input" v-if="state.buttonFlag">
            Hello world
        </pl-input>
        <div style="padding: 12px;background-color: #8A2BE2;color: white;" @click="state.buttonFlag = !state.buttonFlag">
            change button:{{state.buttonFlag}}
        </div>
        <!--<div v-for="item in ['primary','success','warn','error','info']" :key="item" :class="`pl-button pl-button-status-${item}`">
            {{item}}
        </div>-->
    </div>
</template>

<script>

    import {Input} from "../../../src";
    import {computed, getCurrentInstance, onMounted, reactive} from 'vue'

    export default {
        name: "demo-button",
        setup() {
            const inputRef = Input.use.ref('input')
            const state = reactive({
                buttonFlag: true,
            })

            const classes = computed(() => {
                console.log('reset classes', !!inputRef.value)
                return {
                    'has-button': !!inputRef.value
                }
            })

            onMounted(() => {
                setTimeout(() => {
                    inputRef.value.methods.clear()
                }, 2000)
            })

            return {
                classes,
                state,
            }
        },
    }
</script>

<style lang="scss">
    @include theme {
        .pl-button {
            @include statusMixin(button) {
                background-color: $value;
                color: white;
            }
        }
    }
</style>