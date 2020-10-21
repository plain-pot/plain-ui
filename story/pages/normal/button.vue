<template>
    <div class="demo-button">
        <pl-button>
            基本用法
        </pl-button>
        <hr>
        <pl-button v-for="item in ['primary','success','warn','error','info']" :key="item" :status="item" style="margin-right: 8px">
            {{item}}
        </pl-button>
    </div>
</template>

<script>

    import {Input} from "../../../src";
    import {computed, getCurrentInstance, onMounted, reactive} from 'vue'

    export default {
        name: "demo-button",
        setup() {
            return {}
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