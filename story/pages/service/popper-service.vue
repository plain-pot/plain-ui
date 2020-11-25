<template>
    <div class="popper-service">
        <demo-row title="基本用法">
            <pl-button label="basic usage" @click="basicUsage.toggle" ref="basicUsage"/>
            <pl-button>aaaa</pl-button>
            <pl-button>bbb</pl-button>
            <pl-button>vvv</pl-button>
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
                        自定义浮层内容 22222222222222222222222
                    </div>
                )
            })
            console.log('create basicUsage')

            return {
                basicUsage,
            }
        },
    }
</script>

<style lang="scss">

</style>