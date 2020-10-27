<template>
    <app-navigator defaultPath="normal/button">
        <article class="app" :style="{paddingLeft:`${config.menuSize}px`,paddingTop:`${config.headSize}px`}">
            <section class="app-head" :style="{height:config.headSize+'px'}">
                <span>{{title}}</span>
            </section>
            <app-menu :style="{width:`${config.menuSize}px`,top:`${config.headSize}px`}"/>
            <section class="app-content">
                <AppNavigatorPage/>
            </section>
        </article>
    </app-navigator>
</template>

<script>
    import {defineComponent} from 'vue';
    import AppMenu from './app/app-menu'
    import {AppNavigator} from './app/app-navigator'
    import {AppNavigatorPage} from "./app/app-navigator-page";

    const config = {
        menuSize: 300,
        headSize: 60,
    }

    export default defineComponent({
        name: 'App',
        components: {
            AppMenu,
            AppNavigator,
            AppNavigatorPage,
        },
        data() {
            return {
                config,
                title: 'plain-ui'
            }
        },
    });
</script>

<style lang="scss">
    html, body {
        margin: 0;
        padding: 0;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .app {
        .app-head {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 40px;
            box-shadow: $boxshadow;
            box-sizing: border-box;
        }

        .app-menu {
            position: fixed;
            left: 0;
            bottom: 0;
            box-shadow: $boxshadow;
            padding: 20px 0;
            box-sizing: border-box;
            overflow-y: auto;
            overflow-x: hidden;
        }

        .app-content {
            box-sizing: border-box;
            padding: 20px;
        }
    }

    @include theme {
        .app .app-head {
            color: $colorPrimary;
            font-size: 24px;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
            font-style: italic;
            font-weight: bold;
        }
    }
</style>
