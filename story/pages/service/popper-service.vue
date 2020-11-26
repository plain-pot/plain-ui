<template>
    <div class="popper-service">
        <demo-row title="基本用法">
            <pl-button label="基本用法一" @click="basicUsage.toggle" ref="basicUsage"/>
        </demo-row>
        <demo-row title="实例服务">
            <pl-button label="实例一" ref="example-1"/>
            <pl-button label="实例一" ref="example-2"/>
        </demo-row>

    </div>
</template>

<script>

    /**
     * 修改 template  不会导致重新初始化组件，修改 script里面的代码才会导致重新初始化。template 只会导致重新render一遍。
     * @author  韦胜健
     * @date    2020/11/25 15:13
     */
    export default {
        name: "popper-service",
        data() {
            const basicUsage = this.$popper({
                reference: () => this.$refs.basicUsage,
                render: () => (
                    <div>
                        基本用法一：
                    </div>
                )
            })
            const basicUsage2 = this.$popper({
                reference: () => this.$refs.basicUsage2,
                render: () => (
                    <div>
                        基本用法二：
                    </div>
                )
            })


            return {
                basicUsage,
                basicUsage2,
            }
        },
    }
</script>

<style lang="scss">

</style>