function getRenderReturn<_,
    Refer,
    OptionProps,
    SetupProps extends OptionProps,
    >(
    option: {
        props?: OptionProps,
        setup: (props: SetupProps) => Refer,
        render: (this: Refer) => any,
    }): Refer {
    return {} as any
}

const a = getRenderReturn({
    props: {
        name: "111",
        age: 11,
    },
    setup: (props: { name: string, age: number }) => {
        console.log(props.age.toPrecision(0))
        console.log(props.name.anchor('1'))
        return {
            props,
            sayHello: () => 123
        }
    },
    render() {
        console.log(this.props.age.toFixed(0))
        this.sayHello()
    }
})