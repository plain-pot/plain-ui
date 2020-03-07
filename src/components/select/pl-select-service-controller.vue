<template>
    <div class="pl-select-service-controller">
        <pl-select-service-item v-for="(index) in items" :key="index"/>
    </div>
</template>

<script lang="ts">
    import PlSelectServiceItem from "./pl-select-service-item.vue";
    import Select, {SelectOption} from "./Select";

    export default {
        name: "pl-select-service-controller",
        components: {PlSelectServiceItem},
        provide() {
            return {
                selectController: this,
            }
        },
        props: {},
        data() {
            return {
                items: [],                                          // 数字数组，用来控制 select-service-item 个数
                insList: [],                                        // select-service-item 实例数组
            }
        },
        computed: {
            /*当前可用的 select-service-item 实例数组*/
            availableInsList() {
                return (this.insList || []).filter(ins => !ins.openFlag && !ins.private)
            },
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            /*创建一个select对象*/
            newSelect(opt: SelectOption) {
                return new Select(opt, this)
            },

            /*---------------------------------------listener-------------------------------------------*/
            /*select-service-item初始化*/
            addItem(item) {
                this.insList.push(item)
            },
            /*select-service-item销毁*/
            removeItem(item) {
                let index = this.insList.indexOf(item)
                if (index > -1) {
                    this.insList.splice(index, 1)
                }
            },

            /*---------------------------------------utils-------------------------------------------*/
            /*获取一个没有使用的 service item实例*/
            async getInstance() {
                let instance;

                if (this.availableInsList.length === 0) {
                    this.items.push(this.items.length)
                    await this.$plain.nextTick()
                }

                instance = this.availableInsList[0]

                return instance
            },
        },
    }
</script>

<style lang="scss">
</style>