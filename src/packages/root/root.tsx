import {designComponent} from "../../use/designComponent";
import {StyleProps, useStyle} from "../../use/useStyle";
import {useSlots} from "../../use/useSlots";

const RootServiceRegister = (() => {
    return () => {
        console.log('服务调用')
    }
})()

export default designComponent({
    name: 'pl-root',
    props: {
        ...StyleProps,
    },
    setup() {
        useStyle()
        const {slots} = useSlots()
        return {
            refer: {
                sayHello: () => true,
            },
            render: () => slots.default()
        }
    },
})