export class KeyGenerator {

    map = new WeakMap<any, string>()
    count = 1

    constructor(public prefixKeyString: string) {}

    get(data: any) {
        const key = this.map.get(data)
        if (!!key) {
            return key
        } else {
            const key = `${this.prefixKeyString}_${this.count++}`
            this.map.set(data, key)
            return key
        }
    }

}