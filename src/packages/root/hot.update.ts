import {createPlainEvent} from "../../plugins/Event";
import {SimpleFunction} from "../../shims";

/**
 * 监听所有请求，如果是热更新，则通知观察者做出相应处理动作
 * @author  韦胜健
 * @date    2020/11/25 20:58
 */
export const HotUpdate = (() => {
    const event = createPlainEvent()
    const EVENT_NAME = 'hot-update'

    function onRequest(this: any, args: any[]) {
        // console.log('on request', args)
        if (args[1].match(/\.hot-update\./)) {
            // console.log('on hot update')
            event.emit(EVENT_NAME, ...args)
        }
    }

    let oldOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args: any[]) {
        onRequest.apply(this, [args])
        return oldOpen.apply(this, args as any)
    };
    return {
        on: (cb: SimpleFunction) => event.on(EVENT_NAME, cb),
        off: (cb: SimpleFunction) => event.off(EVENT_NAME, cb),
        once: (cb: SimpleFunction) => event.once(EVENT_NAME, cb),
    }
})();