export interface PopperOption {
    reference: HTMLElement | any,
    $slots: Object[],
    render: Function,
    popperProps: Object,
    private: boolean,
}

export class Popper {

    ins;

    constructor(public option: PopperOption, public controller: any) {
    }

    async show() {
        if (this.isShow()) return
        if (!this.ins) {
            this.ins = await this.controller.getInstance()
        }
        this.ins.bind(this)
        this.ins.show()
    }

    hide() {
        if (!this.isShow()) return
        this.ins.hide()
    }

    toggle() {
        if (this.isShow()) {
            this.hide()
        } else {
            this.show()
        }
    }

    isShow(): boolean {
        if (!this.ins) {
            console.log('no ins')
            return false
        } else {
            return this.ins.isShow
        }
    }

    isOpen() {
        if (!this.ins) return false
        return this.ins.isOpen
    }

    destroy() {
        if (this.isShow()) {
            this.hide()
        }
        if (!!this.ins) {
            this.ins.unbind(this)
        }
    }
}
