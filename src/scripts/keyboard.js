/**
 * 监听键盘事件
 * @author  韦胜健
 * @date    2019/1/25 11:06
 */
const Keyboard = {
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
    listeners: [],
    domListeners: [],
    addListener(listener) {
        /*已经监听过了就不再监听*/
        for (let i = 0; i < this.listeners.length; i++) {
            const {listener: lstn} = this.listeners[i];
            if (lstn === listener) return
        }
        /*当监听某个快捷键的情况下，默认阻止默认事件的发生*/
        const keydown = (e) => {
            if (e.target.tagName !== 'BODY') return
            const names = [];
            e.ctrlKey && names.push('ctrl')
            e.shiftKey && names.push('shift')
            e.altKey && names.push('alt')
            names.push(this.code[e.keyCode])
            const name = names.join('+')
            // console.log('Keyboard-->>' + name);
            !!listener[name] && (e.returnValue = listener[name](e, name))
        }
        window.document.addEventListener('keydown', keydown)
        this.listeners.push({keydown, listener})
    },
    removeListener(l) {
        for (let i = 0; i < this.listeners.length; i++) {
            const {keydown, listener} = this.listeners[i];
            if (listener === l) {
                window.document.removeEventListener('keydown', keydown)
                this.listeners.splice(i, 1)
                return
            }
        }
    },
    listen(dom, listener) {
        const mouseenter = () => this.addListener(listener)
        const mouseleave = () => this.removeListener(listener)
        dom.addEventListener('mouseenter', mouseenter)
        dom.addEventListener('mouseleave', mouseleave)
        this.domListeners.push({mouseenter, mouseleave, dom})
    },
    destroyed(dom) {
        for (let i = 0; i < this.domListeners.length; i++) {
            const {mouseenter, mouseleave, dom: d} = this.domListeners[i];
            if (dom === d) {
                dom.removeEventListener('mouseenter', mouseenter)
                dom.removeEventListener('mouseleave', mouseleave)
                this.domListeners.splice(i, 1)
                return
            }
        }
    },
}

export default Keyboard