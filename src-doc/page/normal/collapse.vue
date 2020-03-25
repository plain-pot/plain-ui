<template>
    <div class="demo-collapse">
        <demo-row title="使用折叠动画">
            <pl-button label="toggle" @click="show1=!show1" :active="show1"/>
            <pl-collapse-transition>
                <div v-if="show1">
                    <div class="demo-collapse-box">
                        demo-collapse-box
                    </div>
                </div>
            </pl-collapse-transition>
        </demo-row>
        <demo-row title="使用折叠组件">
            <pl-collapse>
                <div slot="head">
                    折叠标题
                </div>
                <div class="demo-collapse-box">
                    折叠内容
                </div>
            </pl-collapse>
        </demo-row>

        <demo-row title="使用折叠组件">
            <pl-collapse-group :limit="1">
                <pl-collapse>
                    <div slot="head">
                        折叠标题
                    </div>
                    <div class="demo-collapse-box">
                        折叠内容
                    </div>
                </pl-collapse>
                <pl-collapse>
                    <div slot="head">
                        折叠标题
                    </div>
                    <div class="demo-collapse-box">
                        折叠内容
                    </div>
                </pl-collapse>
                <pl-collapse>
                    <div slot="head">
                        折叠标题
                    </div>
                    <div class="demo-collapse-box">
                        折叠内容
                    </div>
                </pl-collapse>
            </pl-collapse-group>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-collapse",
        data() {
            return {
                show1: false
            }
        },
    }
</script>

<style lang="scss">
    .demo-collapse-box {
        height: 100px;
        font-size: 12px;
        padding: 12px 16px;
    }
</style>