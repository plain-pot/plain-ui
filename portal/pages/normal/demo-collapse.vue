<template>
    <div class="demo-collapse">
        <im-demo-row title="使用折叠动画">
            <im-button label="toggle" @click="show1=!show1" :active="show1"/>
            <im-collapse-transition>
                <div v-if="show1">
                    <div class="demo-collapse-box">
                        demo-collapse-box
                    </div>
                </div>
            </im-collapse-transition>
        </im-demo-row>
        <im-demo-row title="使用折叠组件">
            <im-collapse>
                <div slot="head">
                    折叠标题
                </div>
                <div class="demo-collapse-box">
                    折叠内容
                </div>
            </im-collapse>
        </im-demo-row>

        <im-demo-row title="使用折叠组件">
            <im-collapse-group :limit="1">
                <im-collapse>
                    <div slot="head">
                        折叠标题
                    </div>
                    <div class="demo-collapse-box">
                        折叠内容
                    </div>
                </im-collapse>
                <im-collapse>
                    <div slot="head">
                        折叠标题
                    </div>
                    <div class="demo-collapse-box">
                        折叠内容
                    </div>
                </im-collapse>
                <im-collapse>
                    <div slot="head">
                        折叠标题
                    </div>
                    <div class="demo-collapse-box">
                        折叠内容
                    </div>
                </im-collapse>
            </im-collapse-group>
        </im-demo-row>
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
        @include public-style;
        height: 100px;
        font-size: 12px;
        padding: 12px 16px;
    }
</style>