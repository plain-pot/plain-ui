import {designComponent} from "../../use/designComponent";
import {StyleProps, useStyle} from "../../use/useStyle";
import {useSlots} from "../../use/useSlots";

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