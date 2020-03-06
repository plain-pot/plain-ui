/**
 * 快捷键辅助插件
 * @author  韦胜健
 * @date    2020/3/6 23:23
 */
const KeyboardEvents = {
    /*订阅数组*/
    options: [],
    code: {
        16: 'shift',
        17: 'ctrl',
        18: 'alt',

        8: 'backspace',
        9: 'tab',
        13: 'enter',
        27: 'esc',
        32: 'space',

        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',

        48: '0',
        49: '1',
        50: '2',
        51: '3',
        52: '4',
        53: '5',
        54: '6',
        55: '7',
        56: '8',
        57: '9',

        65: 'a',
        66: 'b',
        67: 'c',
        68: 'd',
        69: 'e',
        70: 'f',
        71: 'g',
        72: 'h',
        73: 'i',
        74: 'j',
        75: 'k',

        76: 'l',
        77: 'm',
        78: 'n',
        79: 'o',
        80: 'p',
        81: 'q',
        82: 'r',
        83: 's',
        84: 't',
        85: 'u',
        86: 'v',
        87: 'w',
        88: 'x',
        89: 'y',
        90: 'z',

        112: 'F1',
        113: 'F2',
        114: 'F3',
        115: 'F4',
        116: 'F5',
        117: 'F6',
        118: 'F7',
        119: 'F8',
        120: 'F9',
        121: 'F10',
        122: 'F11',
        123: 'F12',
    },
    /*安装插件*/
    install(Vue) {
        let $plain = Vue.prototype.$plain;
        $plain.$keyboard = KeyboardEvents
        document.body.addEventListener('keydown', e => this._onkeydown(e))
    },
    /*订阅点击事件*/
    listen(option) {
        if (!option) return
        this.options.push(option)
    },
    /*取消订阅事件*/
    unbindListener(option) {
        let index = this.options.indexOf(option)
        if (index > -1) {
            this.options.splice(index, 1)
        }
    },
    /*取消当前激活的元素*/
    cancelActiveElement() {
        const activeElement = document.activeElement
        if (!!activeElement) activeElement.blur()
        return activeElement
    },
    /*处理window的点击事件*/
    _onkeydown(e) {
        if (e.currentTarget !== e.target) return
        const names = [];
        e.ctrlKey && names.push('ctrl')
        e.shiftKey && names.push('shift')
        e.altKey && names.push('alt')
        names.push(this.code[e.keyCode])
        const compositionKeyName = names.join('+')

        const option = this.options[this.options.length - 1]
        if (!!option && !!option[compositionKeyName]) {
            const flag = option[compositionKeyName](e)
            /*默认阻止事件冒泡*/
            if (flag !== false) {
                e.stopPropagation()
                e.preventDefault()
            }
        }
    },
}

export default KeyboardEvents