export default class FileService {
    Vue;

    accept = {
        img: 'image/gif, image/jpeg, image/png, image/jpg',
        excel: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }

    constructor(Vue) {
        this.Vue = Vue
    }

    _input;
    get input() {
        if (!this._input) this._input = this.newInput()
        return this._input
    }

    newInput() {
        if (!window['FileReader']) {
            this.Vue.prototype.$dialog.show({message: '您的浏览器设备不支持图片预览，试试用chrome吧！'})
            return;
        }
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.style.display = 'none'
        document.body.appendChild(input);
        return input;
    }

    async getFile(multiple, type) {
        !!multiple ? this.input.setAttribute('multiple', 'multiple') : this.input.removeAttribute('multiple')
        !!type && this.input.setAttribute('accept', this.accept[type])

        return new Promise((rs) => {
            if (!!this.input._change) {
                this.input.value = null;
                this.input.removeEventListener('change', this.input._change)
                this.input._change = null
            }
            this.input._change = async e => {
                const files = []
                for (let i = 0; i < e.target.files.length; i++) {
                    const file = e.target.files[i];
                    files.push(file)
                }
                rs(multiple ? files : files[0])
            }
            this.input.addEventListener('change', this.input._change);
            this.input.click()
        });
    }

}
