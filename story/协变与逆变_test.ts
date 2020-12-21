import {defineComponent} from "vue"

function getRenderReturn<_,
    Refer,
    OptionProps,
    >(
    option: {
        props?: OptionProps,
        setup: (this: OptionProps) => Refer,
        render: (refer: Refer) => any,
    }): Refer {
    return {} as any
}

const a = getRenderReturn({
    props: {
        name: "111",
        age: 11,
    },
    setup() {
        console.log(this.age.toPrecision(0))
        console.log(this.name.anchor('1'))
        return {
            sayHello: () => 123
        }
    },
    render(refer) {
        // console.log(refer.props.age.toFixed(0))
        // refer.sayHello()
    }
})

defineComponent({
    props: {
        type: {type: HTMLDivElement, required: true}
    },
    data() {
        return {
            type2: this.type,
            name: '111',
            age: 111,
        }
    },
    render() {
        console.log(this.type2.scrollLeft)
        console.log(this.name.charCodeAt(0))
    },
})