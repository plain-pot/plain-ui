import {defineComponent} from "vue"

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

function fun<_,
    Props,
    Setup extends (props: Props) => any,
    Render extends (refer: ReturnType<Setup>) => any,
    >({}: {
    props: Props,
    setup: Setup,
    render: Render,
}): ReturnType<Setup> {
    return {} as any
}

const a = fun({
    props: {name: '111', age: 111},
    setup: (props) => {
        console.log(props.name.charAt(0))
        return {
            ...props,
            sayHello: () => null,
        }
    },
    render: (refer) => {
        console.log(refer.sayHello())
    }
})


