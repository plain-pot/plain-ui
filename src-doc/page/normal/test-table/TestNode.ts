import {TestMark} from "./TestMark";

export class TestNode {
    constructor(
        public key: string,
        public data: any,
        public markGetter: () => TestMark,
    ) {}

    isChecked() {return this.markGetter().check.get(this.key)}

    check(val: boolean) {this.markGetter().check.set(this.key, val)}
}