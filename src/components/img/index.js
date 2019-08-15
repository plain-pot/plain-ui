import PlImgPreview from './pl-img-preview'

class ImageService {

    $plain

    constructor($plain) {
        this.$plain = $plain
    }

    instance

    get $preview() {
        // if (!this.instance) this.instance = this.$plain.newInstance(PlImgPreview)
        this.instance = this.$plain.newInstance(PlImgPreview)
        return this.instance
    }

    preview(...args) {
        this.$preview.preview(...args)
    }

}

export {ImageService}
