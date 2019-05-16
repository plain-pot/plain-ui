<template>
    <transition name="pl-transition-from-bottom">
        <div class="pl-nav-pages" v-show="show">
            <transition-group name="pl-transition-from-right">
                <pl-nav-page
                        ref="pages"
                        v-for="(item) in pages"
                        :key="item.id"
                        :id="item.id"
                        :page="item"
                        :tab="rootPage"/>
            </transition-group>
        </div>
    </transition>
</template>

<script>
    import {NAV_STORAGE_KEY, Page} from "./index";
    import PlNavPage from "./pl-nav-page";

    export default {
        name: "pl-nav-pages",
        components: {PlNavPage},
        props: {
            id: {required: true},                               //pages的id
            rootPage: {},                                       //根页面
            storageKey: {type: Function},                       //存储时的标志key
            storage: {type: Boolean, default: true},            //是否缓存
            setStorage: {type: Function},                       //设置缓存
            getStorage: {type: Function},                       //获取缓存
            beforePush: {type: Function},                       //push页面之前触发动作
            afterPush: {type: Function},                        //push页面之后触发动作
            getComponent: {type: Function},                     //获取页面

            show: {default: true},
        },
        data() {
            return {
                pagesStorage: null,
                selfStorage: null,
                pages: [],
                listener: new this.$plain.Vue({render: () => <span></span>}).$mount()
            }
        },
        created() {
            this.pl_init()
        },
        methods: {

            /*
             *  开页面
             *  @author     martsforever
             *  @datetime   2019/3/30 22:45
             */
            async push({path, param, frame, props}) {
                const page = new Page({path, param, frame, props, init: true, id: this.$plain.$utils.uuid()})
                !!this.beforePush && await this.beforePush(page, this.rootPage)
                page.component = await this.pl_registryPage(page.path, page.frame)
                !!this.afterPush && await this.afterPush(page)
                this.pages.push(page)
                this.pl_save()
                this.$emit('push', page)
                this.$emit('change', page)
                return page
            },
            /*
             *  回退页面时，上一个页面监听回退事件所接受的参数
             *  @author     martsforever
             *  @datetime   2019/3/30 23:57
             */
            async back(data, num = 1) {
                /*最后一页不可销毁*/
                if (this.pages.length === 1) {
                    console.info("is last page!!!")
                    return
                }
                const popIndex = this.pages.length - num
                /*先初始化弹出页面之后留下的页面*/
                this.pages.forEach(async (page, index) => {
                    if (index >= popIndex - 2 && index < popIndex && !page.init && !page.component) {
                        page.component = await this.pl_registryPage(page.path, page.frame)
                        page.init = true
                    }
                })
                /*执行弹出页面的back方法*/
                for (let i = popIndex; i < this.pages.length; i++) {
                    const page = this.pages[i];
                    const navPageInstance = this.pl_getPageInstance(page)
                    /*beforeBack函数中不能做任何逻辑操作，只能做是否能够回退的判断*/
                    await navPageInstance.beforeBack(data)
                }
                await this.$plain.nextTick()
                /*弹出页面*/
                const popPages = this.pages.splice(popIndex, this.pages.length)

                /*执行留下的最后一个页面的onBack方法*/
                const lastPageInstance = this.pl_getPageInstance(this.pages[this.pages.length - 1])
                lastPageInstance.onBack(data)

                /*缓存以及派发事件*/
                await this.pl_save()
                this.$emit('back', popPages)
                this.$emit('change', popPages)
                return popPages
            },
            /*
             *  重定向页面
             *  @author     martsforever
             *  @datetime   2019/3/31 9:23
             */
            async redirect({path, param, frame, props}) {
                const popPage = this.pages[this.pages.length - 2]
                await (this.pl_getPageInstance(popPage)).beforeBack()
                await this.push({path, param, frame, props})
                await this.$plain.nextTick()
                this.pages.splice(this.pages.length - 2, 1)
                this.pl_save()
                this.$emit('redirect')
                this.$emit('change')
            },
            /*
             *  回退所有页面，只留下根页面
             *  @author     martsforever
             *  @datetime   2019/3/31 17:08
             */
            async backOff(data) {
                return await this.back(data, this.pages.length - 1)
            },

            /*---------------------------------------导航广播-------------------------------------------*/
            on(event, callback) {
                this.listener.$on(event, callback)
            },
            once(event, callback) {
                this.listener.$once(event, callback)
            },
            off(event, callback) {
                this.listener.$off(event, callback)
            },
            emit(event, param, global) {
                !global ? this.listener.$emit(event, param) : this.$emit('emit', {event, param})
            },

            /*
             *  缓存页面信息
             *  @author     martsforever
             *  @datetime   2019/3/30 22:32
             */
            async pl_save() {
                if (!this.storage) return
                this.selfStorage.pages = this.pages.map(item => item.saveData())
                this.pagesStorage[this.id] = this.selfStorage
                this.pl_setStorage(NAV_STORAGE_KEY.PAGE, this.pagesStorage)
            },
            /*
             *  初始化页面组件
             *  @author     martsforever
             *  @datetime   2019/3/30 22:33
             */
            async pl_init() {
                let pages = []
                const pagesStorage = this.pl_getStorage(NAV_STORAGE_KEY.PAGE)
                const selfStorage = pagesStorage[this.id] || {}
                const storagePages = selfStorage.pages
                Object.assign(this, {pagesStorage, selfStorage})
                if (!!storagePages && storagePages.length > 0) {
                    pages = storagePages.map((item, index) => new Page(Object.assign({}, item, {id: this.$plain.$utils.uuid(), init: index >= storagePages.length - 2})))
                    this.$nextTick(async () => {
                        for (let i = pages.length - 1; i >= 0; i--) {
                            const page = pages[i];
                            if (page.init && !page.component) page.component = await this.pl_registryPage(page.path, page.frame)
                        }
                    })
                } else {
                    !!this.rootPage && this.$nextTick(async () => await this.push(this.rootPage))
                }
                this.pages = pages
            },
            /*
             *  注册页面组件
             *  @author     martsforever
             *  @datetime   2019/3/31 9:29
             */
            async pl_registryPage(path, frame) {
                if (!!frame) return 'iframe'
                if (!!this.getComponent) return await this.getComponent(path)
                return this.$plain.pageRegistry(path)
            },
            /*
             *  获取页面组件实例
             *  @author     martsforever
             *  @datetime   2019/3/31 9:29
             */
            pl_getPageInstance(page) {
                return this.$plain.$utils.findOne(this.$refs.pages, i => i.page === page)
            },

            /*
             *  关闭页签触发动作
             *  @author     martsforever
             *  @datetime   2019/3/31 22:20
             */
            async pl_closeAll() {
                /*执行弹出页面的back方法*/
                for (let i = 0; i < this.pages.length; i++) {
                    const page = this.pages[i];
                    const navPageInstance = this.pl_getPageInstance(page)
                    /*beforeBack函数中不能做任何逻辑操作，只能做是否能够回退的判断*/
                    await navPageInstance.beforeBack()
                }
                this.pages.splice(0, this.pages.length)
                this.pl_save()
            },
            pl_getStorage(key) {
                if (!!this.getStorage) return this.getStorage(key)
                const storage = this.$plain.$storage.get(key) || {}
                return !!this.storageKey ? storage[this.storageKey] : storage
            },
            pl_setStorage(key, value) {
                if (!!this.setStorage) return this.setStorage(key, value)
                let storage = this.$plain.$storage.get(key) || {}
                if (!!this.storageKey) {
                    storage[this.storageKey] = value
                } else {
                    storage = value
                }
                this.$plain.$storage.set(key, storage)
            },
        }
    }
</script>