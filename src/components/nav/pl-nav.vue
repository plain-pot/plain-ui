<template>
    <div class="pl-nav">
        <div class="pl-nav-header-wrapper">
            <pl-nav-header :list="tabs"
                           label-key="title"
                           value-key="id"
                           @close="pl_headCloseTab"
                           @contextmenu="pl_headCloseTab"
                           @click="({index})=>pl_showTab(index)"
                           :value="p_index"/>
        </div>
        <div class="pl-nav-body">
            <pl-nav-pages
                    ref="pages"
                    v-for="(tab,index) in tabs"
                    :key="tab.id"
                    :id="tab.id"
                    :root-page="tab"
                    :storage="!disabledStorage && tab.storage"
                    :set-storage="setStorage"
                    :get-storage="getStorage"
                    :before-push="beforePush"
                    :after-push="afterPush"
                    :get-component="pl_getComponent"
                    v-if="tab.init"
                    :show="tab.init && p_index === index"

                    @emit="pl_emit"/>
        </div>
    </div>
</template>

<script>
    import PlNavHeader from "./pl-nav-header";
    import {NAV_STORAGE_KEY, Tab} from "./index";
    import PlNavPages from "./pl-nav-pages";
    import PlIcon from "../pl-icon";

    export default {
        name: "pl-nav",
        components: {PlIcon, PlNavPages, PlNavHeader},
        props: {
            noHeader: {type: Boolean},                                          //不显示页签标题
            default: {type: Object},                                            //默认页面
            maxTabs: {type: Number},                                            //最大可以打开的tabs数目

            beforeOpenTab: {type: Function},                                    //打开页签之前的钩子函数
            afterOpenTab: {type: Function},                                     //打开页签之后的钩子函数
            beforePush: {type: Function},                                       //打开页面之前的钩子函数
            afterPush: {type: Function},                                        //跳转页面之后的钩子函数

            pageRegistryErrorHandler: {type: Function},                         //请求页面js文件出错处理
            page404: {type: String},                                            //找不到页面时，显示的404页面
            storageKey: {type: String},                                         //多页面应用同时使用这个导航组件的话，缓存可能会冲突，这里未设置缓存的关键字，不同单页面应用的key应该不同
            showPathInUrl: {type: Boolean, default: true},                      //是否在地址栏显示页面路径
            disabledStorage: {type: Boolean},                                   //是否缓存页面历史
        },
        data() {
            const historyStorage = this.$plain.$storage.get(NAV_STORAGE_KEY.HISTORY) || []
            return {
                historyStorage,
                tabs: [],
                selfStorage: null,
                p_index: null,
            }
        },
        created() {
            this.pl_init();
        },
        methods: {

            /*
             *  打开一个新的页签
             *  @author     martsforever
             *  @datetime   2019/3/31 19:47
             */
            async openTab({id, title, path, param, frame, props, storage = true}, refresh = false) {
                let tab = new Tab({id, title, path, param, frame, props, storage, init: true})
                !!this.beforeOpenTab && await this.beforeOpenTab(tab)
                if (!tab.id) return Promise.reject('id can not be null!')

                const {tab: oldTab, index} = this.pl_findTabById(tab.id)
                if (!!oldTab && index != null) {
                    tab = Object.assign(oldTab, tab)
                    if (refresh) await this.refresh(tab.id)
                    this.p_index = index
                } else if (!!this.maxTabs && this.tabs.length === this.maxTabs) {
                    const msg = `最多只能打开${this.maxTabs}个页签！`
                    this.$message.show(msg)
                    return Promise.reject(msg)
                } else {
                    this.tabs.push(tab)
                    await this.$plain.nextTick()
                    this.p_index = this.tabs.length - 1
                }
                !!this.afterOpenTab && !!this.afterOpenTab(tab)
                this.pl_saveHistory(tab)
                this.pl_save()
                this.$emit('openTab', tab)
                return tab
            },
            /*
             *  关闭页签
             *  @author     martsforever
             *  @datetime   2019/3/31 20:42
             */
            async closeTab(id) {
                return this.pl_closeTab(id)
            },
            /*
             *  刷新某个页签
             *  @author     martsforever
             *  @datetime   2019/3/31 19:58
             */
            async refresh(id) {
                this.pl_clearTabCache(id)
                const {tab} = this.pl_findTabById(id)
                tab.init = false
                await this.$plain.nextTick()
                tab.init = true
            },
            /*
             *  更新tab信息
             *  @author     martsforever
             *  @datetime   2019/3/31 20:55
             */
            async update(id, newTabData) {
                const {tab} = this.pl_findTabById(id)
                if (this.tabs.length === 0 || !tab) return
                Object.assign(tab, newTabData)
                this.p_save()
                this.refresh(tab.id)
                return tab
            },
            /*
             *  获取当前tab
             *  @author     martsforever
             *  @datetime   2019/3/31 20:56
             */
            getCurrentTab() {
                return this.tabs.length > 0 && this.p_index != null ? this.tabs[this.p_index] : null
            },
            /*
             *  获取缓存
             *  @author     martsforever
             *  @datetime   2019/3/31 20:02
             */
            getStorage(key) {
                const storage = this.$plain.$storage.get(key) || {}
                return !!this.storageKey ? storage[this.storageKey] : storage
            },
            /*
             *  设置缓存
             *  @author     martsforever
             *  @datetime   2019/3/31 20:02
             */
            setStorage(key, value) {
                let storage = this.$plain.$storage.get(key) || {}
                if (!!this.storageKey) {
                    storage[this.storageKey] = value
                } else {
                    storage = value
                }
                this.$plain.$storage.set(key, storage)
            },
            /*
             *  根据id找到对应的tab
             *  @author     martsforever
             *  @datetime   2019/3/31 19:56
             */
            pl_findTabById(id) {
                for (let i = 0; i < this.tabs.length; i++) {
                    const tab = this.tabs[i];
                    if (tab.id === id) {
                        return {tab, index: i}
                    }
                }
                return {}
            },
            /*
             *  清除tab缓存
             *  @author     martsforever
             *  @datetime   2019/3/31 20:04
             */
            pl_clearTabCache(id) {
                const storage = this.getStorage(NAV_STORAGE_KEY.PAGE)
                storage[id] = null
                this.setStorage(NAV_STORAGE_KEY.PAGE, storage)
            },
            /*
             *  缓存所有tab数据
             *  @author     martsforever
             *  @datetime   2019/3/31 20:40
             */
            pl_save() {
                if (!!this.disabledStorage) return
                this.selfStorage.index = this.p_index
                this.selfStorage.tabs = this.tabs.map(item => item.saveData())
                this.setStorage(NAV_STORAGE_KEY.TAB, this.selfStorage)
            },
            /*
             *  初始化数据信息
             *  @author     martsforever
             *  @datetime   2019/3/31 21:00
             */
            pl_init() {
                let tabs = []
                /*从缓存中获取页面信息*/
                let selfStorage = this.getStorage(NAV_STORAGE_KEY.TAB)
                if (selfStorage.index != null && !!selfStorage.tabs && selfStorage.tabs.length > 0) {
                    tabs = selfStorage.tabs.map((item) => new Tab(item))
                    this.$nextTick(() => this.pl_showTab(selfStorage.index))
                }
                this.tabs = tabs
                this.selfStorage = selfStorage
            },
            /*
             *  关闭tab
             *  @author     martsforever
             *  @datetime   2019/3/31 20:51
             */
            async pl_closeTab(id) {
                if (this.tabs.length === 1) {
                    const msg = "不能关闭所有页面！"
                    this.$message.show("不能关闭所有页面！")
                    return Promise.reject(msg)
                }
                const {tab, index} = this.pl_findTabById(id)
                if (!tab) return

                /*执行page的beforeBack方法*/
                const pagesComponent = this.$plain.$utils.findOne(this.$refs.pages, item => item.id === id)
                !!pagesComponent && await pagesComponent.pl_closeAll()

                /*切换下一个显示的tab*/
                let nextIndex = this.p_index
                if (index <= nextIndex) nextIndex--;
                const closeTab = this.tabs.splice(index, 1)
                if (nextIndex < 0 && this.tabs.length > 0) nextIndex = 0
                nextIndex > -1 && (await this.pl_showTab(nextIndex))
                this.pl_save()
                this.$emit('closeTab', closeTab)
                return closeTab
            },
            /*
             *  显示tab
             *  @author     martsforever
             *  @datetime   2019/3/31 20:50
             */
            async pl_showTab(index) {
                if (!!this.p_index === index) return
                this.p_index = index
                const ret = await this.openTab(this.tabs[index], false)
                this.pl_save()
                return ret
            },
            /**
             * 获取页面组件
             * @author  韦胜健
             * @date    2019/4/1 09:20
             */
            async pl_getComponent(path, frame) {
                if (!!frame) return 'iframe'
                try {
                    return await this.$plain.pageRegistry(path)
                } catch (e) {
                    console.info('注册页面失败，转错误处理')
                    console.error(e)
                    !!this.pageRegistryErrorHandler && await this.pageRegistryErrorHandler(path)
                    return await this.$plain.pageRegistry(this.page404)
                }
            },
            /*
             *  关闭tab
             *  @author     martsforever
             *  @datetime   2019/3/31 21:03
             */
            pl_headCloseTab({index}) {
                this.pl_closeTab(this.tabs[index].id)
            },
            /**
             * 处理全局广播事件
             * @author  韦胜健
             * @date    2019/4/1 10:00
             */
            pl_emit({event, param}) {
                this.$refs.pages.forEach(item => item.listener.$emit(event, param))
            },
            /**
             * 打开空白页面
             * @author  韦胜健
             * @date    2019/4/1 19:21
             */
            pl_openBlank() {
                this.openTab({
                    id: this.$plain.$utils.uuid(),
                    title: '快捷入口',
                    path: 'blank',
                })
            },
            /**
             * 保存页面打开的历史
             * @author  韦胜健
             * @date    2019/4/1 20:30
             */
            pl_saveHistory(tab) {
                const existIndex = this.$plain.$utils.indexOf(this.historyStorage, item => item.id === tab.id || item.title === tab.title)
                if (existIndex != null) this.historyStorage.splice(existIndex, 1)
                this.historyStorage.unshift(tab)
                if (this.historyStorage.length >= 10) this.historyStorage.splice(10, this.historyStorage.length)
                this.$plain.$storage.set(NAV_STORAGE_KEY.HISTORY, this.historyStorage)
            },
        }
    }
</script>

<style lang="scss">
    @include themeWrap {
        $tabColor: #eee;
        .pl-nav {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            border: 1px solid plVar(colorBorder);
            box-shadow: plVar(boxShadow);
            border-radius: plVar(borderFillet);

            .pl-nav-header-wrapper {
                background-color: #f2f2f2;
                border-bottom: 1px solid plVar(colorBorder);

                .pl-nav-header {
                    width: 100%;
                    display: flex;
                    flex-wrap: nowrap;
                    .pl-nav-header-item {
                        display: inline-flex;
                        cursor: pointer;
                        user-select: none;
                        border-right: 1px solid plVar(colorBorder);

                        .pl-nav-header-item-content {
                            display: flex;
                            width: 200px;
                            height: 36px;
                            align-items: center;
                            box-sizing: border-box;
                            padding: 0 12px;
                            font-size: 12px;
                            font-weight: bold;
                            color: plVar(colorContentSub);

                            .pl-tooltip-text {
                                flex: 1;
                            }
                        }

                        &.pl-nav-header-item-active {
                            background-color: white;
                            color: plVar(colorTitle);
                        }
                    }
                }
            }

            .pl-nav-body {
                flex: 1;
                box-sizing: border-box;
                position: relative;
                overflow: hidden;
                width: 100%;
            }
        }

        .pl-nav-page {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            overflow: auto;
            background-color: white;
            @include transition-all;

            .pl-nav-page-target {
                width: 100%;
                height: 100%;
                overflow: auto;
            }
        }
        .pl-nav-pages {
            height: 100%;
            width: 100%;
            position: absolute;
            overflow: hidden;
        }
    }
</style>