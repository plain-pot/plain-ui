function paramComponent<
    Props,
    Setup extends (props: Props) => any,
    Render extends (refer: ReturnType<Setup>) => any>
(props: Props, setup: Setup, render: Render) {}

function optionComponent<
    Props,
    Setup extends (props: Props) => any,
    Render extends (refer: ReturnType<Setup>) => any>
(option:{
    props: Props,
    setup: Setup,
    render: Render
}) {}

paramComponent({
    name: 'abc',
    age: 123,
    level: 1,
}, function (props) {
    return {
        ...props,
        amdYes: 123,
    }
}, function (refer) {
    // 这里的refer可以正确推断为setup函数的返回值
})

optionComponent({
    props: {
        name: 'abc',
        age: 123,
        level: 1,
    },
    setup(props) {
        return {
            ...props,
            amdYes: 123,
        }
    },
    render(refer) {
        // 这里的refer推断是any
    },
})