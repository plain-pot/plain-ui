<template>
    <div class="app-content" :style="rootStyles">
        <div class="app-content-body">

            <input type="text">
            <pl-button-group>
                <pl-button label="山脉" @click="onClick(1)"/>
                <pl-button label="深林" @click="onClick(2)"/>
                <pl-button label="沼泽" @click="onClick(3)"/>
            </pl-button-group>
        </div>
    </div>
</template>

<script>
    import PlainUtils from "../../submodules/plain-utils";

    export default {
        name: "app-content",
        inject: {
            appHome: {}
        },
        data() {
            return {
                label: new Promise((resolve) => {
                    setTimeout(() => resolve('HELLO'), 1000)
                })
            }
        },
        computed: {
            rootStyles() {
                return {
                    paddingTop: PlainUtils.suffixPx(this.appHome.headerHeight),
                    paddingLeft: PlainUtils.suffixPx(this.appHome.menuWidth),
                    paddingRight: '1px',
                }
            },
        },
        methods: {
            onClick(e) {
                console.log('click', new Date().getTime(), e,)
            },
        },
    }
</script>

<style lang="scss">
    .app-content {
        box-sizing: border-box;
        width: 100%;

        .app-content-body {
            padding: 16px;
            min-height: calc(100vh - 100px);
        }
    }
</style>