<template>
    <div class="demo-plain-popper">
        <demo-row title="基本用法">
            <div style="height: 150px">
                <plain-popper component="pl-input"
                              :componentBinding="inputBinding"
                              v-if="showFlag"
                              :placement="`${direction}-${align}`"
                >
                    <div class="demo-plain-popper-content">
                        this is popper content
                    </div>
                </plain-popper>
            </div>
            <pl-checkbox v-model="showFlag" label="showFlag"/>
            <p>
                <pl-button-group>
                    <pl-button v-for="item in directions" :label="item" :key="item" @click="direction = item" :active="item === direction"/>
                </pl-button-group>
            </p>
            <p>
                <pl-button-group>
                    <pl-button v-for="item in aligns" :label="item" :key="item" @click="align = item" :active="item === align"/>
                </pl-button-group>
            </p>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-plain-popper",
        props: {},
        data() {
            return {
                showFlag: true,
                direction: 'top',
                align: 'center',
                directions: ['top', 'bottom', 'left', 'right'],
                aligns: ['start', 'center', 'end'],

                inputBinding: {
                    props: {
                        suffixIcon: 'el-icon-arrow-down'
                    },
                },
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
    .demo-plain-popper {
    }

    .demo-plain-popper-content {
        height: 100px;
        width: 70px;
    }
</style>