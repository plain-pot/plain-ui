<template>
    <div class="pl-nav-page">
        <component
                class="pl-nav-page-target"
                ref="page"
                :is="page.component"
                :param="page.param"
                :tab="tab"
                v-bind="page.props"
                :path="page.path"
                :src="page.path"
                v-if="!!page.component && page.init"
                :nav="p_nav"/>
    </div>
</template>

<script>
    export default {
        name: "pl-nav-page",
        props: {
            id: {type: String, required: true},             //page的id
            page: {},                                       //page页面的数据信息
            tab: {},

            nav: {},
        },
        data() {
            const pages = this.$plain.$dom.findComponentUpward(this, 'pl-nav-pages')
            const events = []
            const that = this
            return {
                events,
                pages,
                p_nav: {
                    push: (...args) => pages.push(...args),
                    back: (...args) => pages.back(...args),
                    redirect: (...args) => pages.redirect(...args),
                    backOff: (...args) => pages.backOff(...args),
                    on: (...args) => that.on(...args),
                    once: (...args) => that.once(...args),
                    off: (...args) => that.off(...args),
                    emit: (...args) => that.emit(...args),

                    openTab: (...args) => this.nav.openTab(...args),
                    closeTab: (id) => {
                        id = id || pages.id
                        this.nav.closeTab(id)
                    },
                    refresh: (id) => {
                        id = id || pages.id
                        this.nav.refresh(id)
                    },
                    update: (id, newTabData) => {
                        id = id || pages.id
                        this.nav.update(id, newTabData)
                    },
                    getCurrentTab: (...args) => this.nav.getCurrentTab(...args),
                }
            }
        },
        methods: {
            /*
             *  back之前执行钩子函数
             *  @author     martsforever
             *  @datetime   2019/3/31 10:40
             */
            beforeBack(data) {
                if (!!this.$refs.page && !!this.$refs.page.beforeBack) {
                    return this.$refs.page.beforeBack(data)
                }
            },
            /*
             * 回退到当前页面时，触发的钩子函数
             *  @author     martsforever
             *  @datetime   2019/3/31 10:40
             */
            onBack(data) {
                if (!!this.$refs.page && !!this.$refs.page.onBack) {
                    return this.$refs.page.onBack(data)
                }
            },

            /**
             * 监听事件
             * @author  韦胜健
             * @date    2019/3/19 18:50
             */
            on(event, callback) {
                this.events.push({event, callback})
                this.pages.on(event, callback)
            },

            /**
             * 只监听一次事件
             * @author  韦胜健
             * @date    2019/3/19 18:51
             */
            once(event, callback) {
                this.events.push({event, callback})
                this.pages.once(event, callback)
            },

            /**
             * 移除事件
             * @author  韦胜健
             * @date    2019/3/19 18:51
             */
            off(event, callback) {
                for (let i = 0; i < this.events.length; i++) {
                    const {event: e, callback: c} = this.events[i];
                    if (event !== e) continue
                    if (callback == null || callback === c) {
                        this.events.splice(i, 1)
                        this.pages.off(event, callback)
                        i--
                        return true
                    }
                }
                return false
            },

            /**
             * 派发事件
             * @author  韦胜健
             * @date    2019/3/19 18:51
             */
            emit(event, param, global) {
                this.pages.emit(event, param, global)
            },
        },
        beforeDestroy() {
            /*页面销毁*/
            if (!this.pages) return
            this.events.forEach(({event, callback}) => this.off(event, callback))
        },
    }
</script>