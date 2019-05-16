const store = require('store')

class StorageService {

    $plain
    store = store
    storageKey = 'plain'
    storage

    constructor($plain) {
        this.$plain = $plain
        this.storage = this.store.get(this.storageKey) || {}
    }

    get(key) {
        return this.storage[key]
    }

    set(key, val) {
        this.storage[key] = val
        this.store.set(this.storageKey, this.storage)
    }
}

export {
    StorageService
}