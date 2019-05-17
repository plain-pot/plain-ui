<template>
    <div class="app">
        <div class="app-header">
            <img :src="logo" alt="plain-logo" class="logo">
            <div>
                <im-button-group>
                    <im-button v-for="theme in ['default','black','red']" :key="theme" @click="$plain.changeTheme(theme)" :label="theme"/>
                </im-button-group>
            </div>
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
                img: require('portal/asserts/background.jpg'),
                logo: require('portal/asserts/plain.png'),
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
        overflow: hidden;
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
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-sizing: border-box;
                padding: 0 plVar(padding);
                border-bottom: 1px solid #ddd;
                .logo {
                    height: 80%;
                    width: auto;
                }
            }

            .app-body {
                flex: 1;
                display: flex;
                position: relative;
                overflow: hidden;
                .app-left {
                    width: 280px;
                    height: 100%;
                    position: relative;
                    &:before {
                        position: absolute;
                        right: 0;
                        width: 3px;
                        top: 0;
                        bottom: 0;
                        content: '';
                        box-shadow: 0 0 12px #ddd;
                    }
                    &:after {
                        position: absolute;
                        right: 1px;
                        width: 10px;
                        top: 0;
                        bottom: 0;
                        content: '';
                        background-color: white;
                    }
                }
                .app-right {
                    flex: 1;
                    overflow: hidden;
                }
            }
        }
    }
</style>