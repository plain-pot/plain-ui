import {TestMark} from "./TestMark";

export class TestNode {
    constructor(
        public key: string,
        public data: any,
        public map: TestMark,
    ) {}

    isChecked() {return this.map.check.get(this.key)}

    check(val: boolean) {this.map.check.set(this.key, val)}
}