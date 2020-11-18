<template>
    <div class="demo-use-slots">
        <pl-input v-model="text"/>
        <br>
        <input type="checkbox" v-model="hasHead" id="hasHead">
        <label for="hasHead">hasHead</label>
        <input type="checkbox" v-model="hasFoot" id="hasFoot">
        <label for="hasFoot">hasFoot</label>

        <demo-use-slots-component :text="text">
            <template #head v-if="hasHead">
                <h2>自定义头部插槽内容</h2>
            </template>
            <template #foot v-if="hasFoot">
                <h2>自定义底部插槽内容</h2>
            </template>
            <button>自定义默认插槽内容</button>
        </demo-use-slots-component>
    </div>
</template>

<script>

    import {DemoUseSlotsComponent} from "./demo-use-slots-component";

    export default {
        name: "demo-use-slots",
        components: {DemoUseSlotsComponent},
        data() {
            return {
                hasHead: true,
                hasFoot: true,
                text: 'hello world'
            }
        },
    }
</script>

<style lang="scss">
    .demo-use-slots-component {
        &.demo-use-slots-component-has-slot-head {
            .demo-use-slots-component-head {
                background-color: #4caf50;
                color: white;
            }
        }
    }
</style>