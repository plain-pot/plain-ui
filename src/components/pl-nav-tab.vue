<template>
    <div class="pl-nav-tab" :style="{height:$plain.$utils.unit(height)}">
        <pl-tab-header clear-icon
                       :data="pageStack"
                       valueKey="id"
                       labelKey="title"

                       :value="p_value"
                       @input="p_clickMenu"
                       @close="p_close"
                       @dblclick="p_close"
                       @contextmenu="({el,index})=>pl_contextmenu({el,index,item:pageStack[index]})"
                       ref="header"/>
        <div class="pl-nav-tab-content">
            <component v-for="(page,index) in pageStack"
                       class="pl-nav-tab-item"
                       :key="page.id"
                       :param="page.param || {}"
                       :is="page.component"
                       v-if="page.init"
                       v-show="p_value === index"/>
            <div class="pl-nav-tab-content-empty" :class="{'pl-nav-tab-content-empty-hide':!!pageStack && pageStack.length>0}">
                <pl-icon icon="pl-nothing"/>
                <span>空空如也</span>
            </div>
        </div>
    </div>
</template>

<script>

    import PlIcon from "./pl-icon";
    import PlTabHeader from "./tab/pl-tab-header";
    import {ValueMixin} from "../mixin/component-mixin";

    const STORAGE_KEY = 'navigator-tab';

    export default {
        name: "pl-nav-tab",
        mixins: [ValueMixin],
        components: {PlTabHeader, PlIcon},
        props: {
            value: {type: Number},                                              //当前显示的页面索引
            initPages: {type: Array, default: () => []},                         //初始化就要显示的页面
            multiple: {type: Boolean},                                          //同一个页面是否只能同时存在一个
            id: {type: String,},                                                //页签id，用来存储当前页签页面页面栈数据的key
            height: {type: Number | String, default: '100%'},                   //高度
        },
        watch: {
            value(val) {
                if (this.p_value !== val && val >= 0 && val < this.pageStack.length) {
                    this.p_clickMenu(val)
                }
            },
        },
        data() {
            let pageStack = []
            let p_value = this.value;
            let tabsStorage, selfStorage;

            let hasStorage = false;

            if (!!this.id) {
                tabsStorage = this.$plain.$storage.get(STORAGE_KEY) || {}
                selfStorage = tabsStorage[this.id] || {}
                if (selfStorage.index != null && !!selfStorage.pageStack && selfStorage.pageStack.length > 0) {
                    hasStorage = true
                    pageStack = selfStorage.pageStack.map((item) => Object.assign({init: false, id: this.$plain.$utils.uuid()}, item))
                    this.$nextTick(() => this.p_clickMenu(selfStorage.index))
                }
            }

            if (!hasStorage && !!this.initPages && this.initPages.length > 0) {
                for (let i = 0; i < this.initPages.length; i++) pageStack.push(Object.assign({init: false, id: this.$plain.$utils.uuid()}, this.initPages[i]))
                this.$nextTick(() => this.p_clickMenu(0))
            }

            return {
                pageStack,
                p_value,
                tabsStorage,
                selfStorage,

                p_watchValue: false,
                p_select: {a: null, b: null},
                p_contextMenu: [
                    {
                        name: '刷新', icon: 'pad-sync', handler: (item) => {
                            this.refresh(item.id)
                        }
                    },
                    {
                        name: '关闭', icon: 'pad-close-circle', handler: (item, index) => {
                            this.close(item.id)
                        }
                    },
                    {
                        name: '关闭左侧标签', icon: 'pad-border-right', handler: (item, index) => {
                            this.pageStack = this.pageStack.splice(index, this.pageStack.length)
                            const {path, title, param} = this.pageStack[0]
                            this.push(path, title, param)
                        }
                    },
                    {
                        name: '关闭右侧标签', icon: 'pad-border-left', handler: (item, index) => {
                            this.pageStack = this.pageStack.splice(0, index + 1)
                            const {path, title, param} = this.pageStack[this.pageStack.length - 1]
                            this.push(path, title, param)
                        }
                    },

                    {
                        name: '关闭其他标签', icon: 'pad-border-horizontal', handler: (item, index) => {
                            this.pageStack = this.pageStack.splice(index, 1)
                            const {path, title, param} = this.pageStack[0]
                            this.push(path, title, param)
                        }
                    },
                ],
            }
        },
        methods: {
            async push(path, title, param) {
                if (!this.multiple) {
                    for (let i = 0; i < this.pageStack.length; i++) {
                        const page = this.pageStack[i];
                        if (page.path === path) {
                            this.p_clickMenu(i)
                            return
                        }
                    }
                }
                const re = await this.getRegisterPageByPath(path)
                if (!re) return
                this.pageStack.push({
                    title: title,
                    path: re.path,
                    component: re.component,
                    param,
                    init: true,
                    id: this.$plain.$utils.uuid()
                })
                this.p_value = this.pageStack.length - 1
                this.p_save()
                this.$emit('change', this.pageStack[this.pageStack.length - 1])
                this.p_emitValue()
            },
            async close(id) {
                const {index} = this.$plain.$utils.findOne(this.pageStack, item => item.id === id, true)
                this.p_close({index})
            },
            async refresh(id) {
                const {item} = this.$plain.$utils.findOne(this.pageStack, item => item.id === id, true)
                item.init = false
                await this.$plain.nextTick()
                item.init = true
            },

            async getRegisterPageByPath(path) {
                const component = await this.$plain.pageRegistry(path)
                return {component, path}
            },
            p_close({index}) {
                let nextIndex = this.p_value
                if (index <= this.p_value) nextIndex--;
                this.pageStack.splice(index, 1)
                if (nextIndex < 0 && this.pageStack.length > 0) nextIndex = 0
                this.p_clickMenu(nextIndex)
            },
            async p_clickMenu(index) {
                this.p_value = index
                const page = this.pageStack[index]
                if (!page) return
                if (!page.component) page.component = (await this.getRegisterPageByPath(page.path)).component
                if (!!page && !page.init) page.init = true
                this.p_save()
                this.$emit('change', page)
                this.p_emitValue()
            },
            p_save() {
                if (!this.id) return
                this.selfStorage.index = this.p_value;
                this.selfStorage.pageStack = this.pageStack.map(({title, path, param}) => {
                    return {title, path, param}
                })
                this.tabsStorage[this.id] = this.selfStorage
                this.$plain.$storage.set(STORAGE_KEY, this.tabsStorage)
            },
            async pl_contextmenu({index, item, el}) {
                let show = !!this.p_select.a ? 'b' : 'a'
                let hide = !!this.p_select.a ? 'a' : 'b'

                if (!!this.p_select[hide]) {
                    this.p_select[hide].hide()
                }
                this.p_select[show] = await this.$plain.$select.getSelect()
                this.p_select[show].select({
                    reference: el,
                    data: this.p_contextMenu,
                    labelKey: 'name',
                    iconKey: 'icon',
                    popper: {
                        height: null,
                    },
                    onClose: () => this.p_select[show] = null
                }).then(ret => {
                    ret.handler(item, index)
                })
            },
            pl_findPageById(id) {
                for (let i = 0; i < this.pageStack.length; i++) {
                    const page = this.pageStack[i];
                    if (page.id === id) {
                        return {page, index: i}
                    }
                }
                return {}
            },
        }
    }
</script>
