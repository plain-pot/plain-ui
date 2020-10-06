/*@formatter:off*/
function paramComponent<
    Props,
    Setup extends (props: Props) => any,
    Render extends (refer: ReturnType<Setup>) => any>
(props: Props, setup: Setup, render: Render) {}
/*@formatter:on*/

/*@formatter:off*/
function optionComponent<
    Props,
    Setup extends (props: Props) => any,
    Render extends (refer: ReturnType<Setup>) => any>
(option:{
    props: Props,
    setup: Setup,
    render: Render
}) {}
/*@formatter:on*/

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

    },
})