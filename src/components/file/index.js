class FileService {
    Vue

    constructor(Vue) {
        this.Vue = Vue
    }

    type = {
        image: 'image/gif, image/jpeg, image/png, image/jpg',
        excel: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }

    get typeKeys() {
        return Object.keys(this.type)
    }

    get $plain() {
        return this.Vue.prototype.$plain
    }

    #input;
    get input() {
        if (!this.#input) {
            this.#input = document.createElement('input')
            this.#input.setAttribute('type', 'file')
            this.#input.style.display = 'none'
            document.body.appendChild(this.#input)
        }
        return this.#input
    }

    getFile({multiple = false, fileType = null, validFunc = null, maxSize = null} = {}) {
        !!multiple ? this.input.setAttribute('multiple', 'multiple') : this.input.removeAttribute('multiple')
        if (!!fileType) {
            if (!!this.typeKeys.indexOf(fileType) > -1) {
                this.input.setAttribute('accept', this.type[fileType])
            } else {
                this.input.setAttribute('accept', fileType)
            }
        } else {
            this.input.removeAttribute('accept')
        }

        return new Promise((rs) => {
            if (!!this.input._change) {
                this.input.value = null
                this.input.removeEventListener('change', this.input._change)
                this.input._change = null
            }
            this.input._change = async e => {
                const files = []
                for (let i = 0; i < e.target.files.length; i++) {
                    const file = e.target.files[i];
                    file.calcSize = (file.size / (1024 * 1024)).toFixed(2)
                    if (!!validFunc && !validFunc(file)) return
                    if (!!maxSize && (file.calcSize) > maxSize) {
                        this.Vue.prototype.$message.show(`[${file.name}]大小为${file.calcSize}兆，超过最大限制${maxSize}兆`, {time: 5000, type: 'error'})
                        return
                    }
                    files.push(file)
                }
                rs(multiple ? files : files[0])
            }
            this.input.addEventListener('change', this.input._change);
            this.input.click()
        })
    }
}

export default FileService
