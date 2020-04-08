<template>
    <div class="demo-row" :class="{'demo-row-show':show}">
        <div v-if="!!title" class="demo-row-title">
            <span @click="show = !show">{{title}}</span>
            <pl-icon icon="el-icon-d-arrow-right" class="demo-row-icon-expand"/>
        </div>
        <pl-collapse-transition>
            <div class="demo-row-content" v-if="show">
                <slot></slot>
            </div>
        </pl-collapse-transition>
    </div>
</template>

<script>
    const STORAGE_KEY = 'DEMO_ROW'
    export default {
        name: "demo-row",
        provide() {
            return {
                PlDemoRow: this,
            }
        },
        inject: {
            appHome: {},
        },
        props: {
            title: {},
        },
        watch: {
            show(val) {
                this.appHome.updateDemoRowCache(this.title, val)
            },
        },
        data() {

            let show = this.appHome.pathCache[this.title]
            if (show == null) show = true

            return {
                maxTitleWidth: null,
                show,
            }
        },
        methods: {
            addItem(demoLine) {
                if (!demoLine.$refs.title) return
                const titleWidth = demoLine.$refs.title.offsetWidth
                if (!this.maxTitleWidth || titleWidth > this.maxTitleWidth) {
                    this.maxTitleWidth = titleWidth
                }
            },

        },
    }
</script>

<style lang="scss">
    .demo-row {
        .demo-row-title {
            border-bottom: dashed 1px #f1f1f1;
            font-size: 14px;
            padding: 14px 24px;
            color: #606266;

            span {
                cursor: pointer;
            }
        }

        .demo-row-content {
            padding: 16px 24px;
            font-size: 14px;

            & > *:not(.demo-line) {
                margin-right: 16px;
            }
        }

        .demo-row-icon-expand {
            transform: rotate(90deg);
            transition: all linear 300ms;
            margin-left: 12px;
        }

        &.demo-row-show {
            & > .demo-row-title > .demo-row-icon-expand {
                transform: rotate(-90deg);
            }
        }
    }
</style>