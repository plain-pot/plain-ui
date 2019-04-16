const $storage = {
    storageKey: 'plain',
    storage: JSON.parse(localStorage.getItem('plain')) || {},
    get(key) {
        return this.storage[key]
    },
    set(key, val) {
        this.storage[key] = val
        localStorage.setItem(this.storageKey, JSON.stringify(this.storage))
    },
}

export default $storage