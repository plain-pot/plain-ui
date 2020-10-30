import {designComponent} from "../../../../src/use/designComponent";
import {useProps} from "../../../../src/use/useProps";
import {watch} from 'vue';

export const DemoUsePropsComponent = designComponent({
    props: {
        name: {type: [String, Object]},
        age: {type: [Number, String]},
        flag: {type: [Boolean, Function]},
        level: {type: Number}
    },
    setup({props}) {

        const {propsState} = useProps(props, {
            name: useProps.PROMISE,
            age: useProps.NUMBER,
            flag: useProps.FUNCTION,
        })

        console.log(propsState)

        watch(() => propsState.name, val => console.log('name', val), {immediate: true})
        watch(() => propsState.age, val => console.log('age', val), {immediate: true})
        watch(() => propsState.flag, val => console.log('flag', val), {immediate: true})

        return {
            render: () => (
                <div>
                    <ul>
                        <li>name:{String(propsState.name)}-{typeof propsState.name}</li>
                        <li>age:{String(propsState.age)}-{typeof propsState.age}</li>
                        <li>flag:{String(propsState.flag)}-{typeof propsState.flag}</li>
                    </ul>
                </div>
            )
        }
    },
})