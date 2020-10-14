import {designComponent} from "@/use/designComponent";

const Alert = designComponent({
    name: 'link-alert',
    props: {
        name: {type: String},
        age: {type: Number, default: 1},
        level: {type: Number, required: true}
    },
    setup(props) {
        return {
            refer: {
                ...props,
                amdYes: 10,
            },
            render() {
                return (
                    <div>
                        123
                    </div>
                )
            },
        }
    },
})