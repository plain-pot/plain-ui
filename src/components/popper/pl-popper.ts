export class PopperTrigger {
    data: any

    constructor(public name: string, public init: Function, public destroy: Function) {
        this.data = {}
    }
}