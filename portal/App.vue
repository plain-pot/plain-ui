<template>
    <div class="app" :style="{backgroundImage:`url('${img}')`}">
        <div class="app-header">
            app-header
        </div>
        <div class="app-body">
            <div class="app-left">
                <app-menu @click="val=>$refs.tab.push(val.page,val.title)" :menu="menu"/>
            </div>
            <div class="app-right">
                <im-nav-tab ref="tab" id="app" @change="val=>menu=val"/>
            </div>
        </div>
    </div>
</template>

<script>
    import AppMenu from "./home/app-menu";

    export default {
        name: "App",
        components: {AppMenu},
        data() {
            return {
                menu: {},
                img: require('portal/asserts/background.jpg')
            }
        },
    }
</script>

<style lang="scss">
    html, body {
        margin: 0;
        padding: 0;
        height: 100vh;
        width: 100vw;
    }

    @include themeWrap {
        .app {
            height: 100%;
            width: 100%;
            background-size: 100% 100%;
            display: flex;
            flex-direction: column;
            .app-header {
                height: 64px;
                position: relative;
                background-color: plVar(backgroundColorDeeper);
                color: plVar(colorTitle);
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-sizing: border-box;
                padding: 0 plVar(padding);
                box-shadow: plVar(boxShadow);
            }

            .app-body {
                flex: 1;
                display: flex;
                position: relative;
                overflow: hidden;
                z-index: 0;
                .app-left {
                    width: 250px;
                    height: 100%;
                    background-color: plVar(backgroundColorDeeper);
                }
                .app-right {
                    flex: 1;
                }
            }
        }
    }
</style>