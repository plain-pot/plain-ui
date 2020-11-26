<template>
    <div class="popper-service">
        <demo-row title="基本用法">
            <pl-button label="基本用法一" @click="basicUsage.toggle" ref="basicUsage"/>
        </demo-row>
        <demo-row title="实例服务">
            <pl-button label="实例一" ref="example1" @click="example1.toggle"/>
            <pl-button label="实例二" ref="example2" @click="example2.toggle"/>
            <pl-input v-model="text"/>
        </demo-row>
        <demo-row title="popper 属性测试">
            <pl-button label="Popper属性测试" @click="testAttrs.toggle" ref="testAttrs"/>
            <pl-button label="Popper属性测试" @click="testAttrs2.toggle" ref="testAttrs2"/>
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

            const createAgent = ({name, content, attrs}) => {
                return this.$popper({
                    reference: () => this.$refs[name],
                    render: () => (
                        <div>
                            {typeof content === "function" ? content() : content}
                        </div>
                    ),
                    popperAttrs: {
                        ...(attrs || {}),
                    },
                })
            }

            const basicUsage = createAgent({
                name: 'basicUsage',
                content: '基本用法'
            })

            const example1 = createAgent({
                name: 'example1',
                content: () => (
                    <div>
                        <p>实例一</p>
                        <pl-input v-model={this.text}/>
                    </div>
                )
            })

            const example2 = createAgent({
                name: 'example2',
                content: () => (
                    <div>
                        <p>实例二</p>
                        <pl-number v-model={this.text}/>
                    </div>
                )
            })

            const testAttrs = createAgent({
                name: 'testAttrs',
                content: () => (
                    <div>
                        <p>testAttrs1</p>
                        高度、对其方式、动画
                    </div>
                ),
                attrs: {
                    height: '80px',
                    width: '200px',
                    placement: 'bottom-end',
                    transition: 'pl-transition-popper-drop',
                },
            })
            const testAttrs2 = createAgent({
                name: 'testAttrs2',
                content: () => (
                    <div>
                        <p>testAttrs2</p>
                        高度、对其方式、动画
                    </div>
                ),
                attrs: {
                    height: '80px',
                    width: '200px',
                    placement: 'top-start',
                    transition: 'pl-transition-popper-drop',
                },
            })

            return {
                basicUsage,
                example1,
                example2,
                text: '123456',
                testAttrs,
                testAttrs2,
            }
        },
    }
</script>

<style lang="scss">
    .popper-service {
        padding-bottom: 500px;
    }
</style>