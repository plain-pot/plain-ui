const NAV_STORAGE_KEY = {
    TAB: 'nav-tab',
    PAGE: 'nav-page',
    BLANK: 'nav-blank',
    HISTORY: 'nav-history',

}

class Page {
    path = null;                //页面地址
    param = null;               //页面参数
    frame = false;              //页面是否为外部地址
    props = null;               //给页面绑定的参数

    id = null;                  //页面的id
    init = false;               //页面是否已经初始化
    component = null;           //页面组件

    constructor(page) {
        Object.assign(this, page)
    }

    saveData() {
        return {
            id: this.id,
            path: this.path,
            param: this.param,
            frame: this.frame,
            props: this.props,
        }
    }
}

class Tab {
    id = null;
    title = null;

    path = null;
    param = null;
    frame = null;
    props = null;
    storage = true;

    init = false;

    constructor(tab) {
        Object.assign(this, tab)
    }

    saveData() {
        return {
            id: this.id,
            title: this.title,
            path: this.path,
            param: this.param,
            frame: this.frame,
            props: this.props,
            storage: this.storage,
        }
    }
}

export {
    NAV_STORAGE_KEY,
    Page,
    Tab,
}